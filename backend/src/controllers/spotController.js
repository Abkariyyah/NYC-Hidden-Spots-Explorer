import prisma from '../utils/prisma.js';
import { enrichSpot } from '../utils/spotHelpers.js';

const spotInclude = {
  user: { select: { id: true, name: true, email: true } },
  reviews: {
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  },
  _count: { select: { savedSpots: true } },
};

function validateSpotBody(body) {
  const errors = [];
  const { name, description, category, borough, address, latitude, longitude, priceRange } = body;

  if (!name?.trim()) errors.push('Name is required');
  if (!description?.trim()) errors.push('Description is required');
  if (!category?.trim()) errors.push('Category is required');
  if (!borough?.trim()) errors.push('Borough is required');
  if (!address?.trim()) errors.push('Address is required');
  if (!priceRange?.trim()) errors.push('Price range is required');

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  if (isNaN(lat) || lat < -90 || lat > 90) errors.push('Valid latitude is required');
  if (isNaN(lng) || lng < -180 || lng > 180) errors.push('Valid longitude is required');

  return { errors, lat, lng };
}

export async function getAllSpots(req, res) {
  try {
    const { category, borough, priceRange, search } = req.query;

    const where = {};
    if (category) where.category = category;
    if (borough) where.borough = borough;
    if (priceRange) where.priceRange = priceRange;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
      ];
    }

    const spots = await prisma.hiddenSpot.findMany({
      where,
      include: spotInclude,
      orderBy: { createdAt: 'desc' },
    });

    res.json(spots.map(enrichSpot));
  } catch (error) {
    console.error('Get spots error:', error.message);
    res.status(500).json({ error: 'Failed to fetch spots', detail: error.message });
  }
}

export async function getTrendingSpots(req, res) {
  try {
    const spots = await prisma.hiddenSpot.findMany({
      include: spotInclude,
    });

    const enriched = spots.map(enrichSpot);
    enriched.sort((a, b) => b.trendingScore - a.trendingScore);

    res.json(enriched.slice(0, 6));
  } catch (error) {
    console.error('Trending error:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending spots', detail: error.message });
  }
}

export async function getSpotById(req, res) {
  try {
    const spot = await prisma.hiddenSpot.findUnique({
      where: { id: req.params.id },
      include: spotInclude,
    });

    if (!spot) {
      return res.status(404).json({ error: 'Spot not found' });
    }

    let isSaved = false;
    if (req.user) {
      const saved = await prisma.savedSpot.findUnique({
        where: {
          userId_hiddenSpotId: {
            userId: req.user.id,
            hiddenSpotId: spot.id,
          },
        },
      });
      isSaved = !!saved;
    }

    res.json({ ...enrichSpot(spot), isSaved });
  } catch (error) {
    console.error('Get spot error:', error);
    res.status(500).json({ error: 'Failed to fetch spot' });
  }
}

export async function createSpot(req, res) {
  try {
    const { errors, lat, lng } = validateSpotBody(req.body);
    if (errors.length) {
      return res.status(400).json({ error: errors.join(', ') });
    }

    const { name, description, category, borough, address, priceRange, imageUrl } = req.body;

    const spot = await prisma.hiddenSpot.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        category,
        borough,
        address: address.trim(),
        latitude: lat,
        longitude: lng,
        priceRange,
        imageUrl: imageUrl?.trim() || null,
        userId: req.user.id,
      },
      include: spotInclude,
    });

    res.status(201).json(enrichSpot(spot));
  } catch (error) {
    console.error('Create spot error:', error);
    res.status(500).json({ error: 'Failed to create spot' });
  }
}

export async function updateSpot(req, res) {
  try {
    const spot = await prisma.hiddenSpot.findUnique({ where: { id: req.params.id } });

    if (!spot) {
      return res.status(404).json({ error: 'Spot not found' });
    }

    if (spot.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own spots' });
    }

    const { errors, lat, lng } = validateSpotBody(req.body);
    if (errors.length) {
      return res.status(400).json({ error: errors.join(', ') });
    }

    const { name, description, category, borough, address, priceRange, imageUrl } = req.body;

    const updated = await prisma.hiddenSpot.update({
      where: { id: req.params.id },
      data: {
        name: name.trim(),
        description: description.trim(),
        category,
        borough,
        address: address.trim(),
        latitude: lat,
        longitude: lng,
        priceRange,
        imageUrl: imageUrl?.trim() || null,
      },
      include: spotInclude,
    });

    res.json(enrichSpot(updated));
  } catch (error) {
    console.error('Update spot error:', error);
    res.status(500).json({ error: 'Failed to update spot' });
  }
}

export async function deleteSpot(req, res) {
  try {
    const spot = await prisma.hiddenSpot.findUnique({ where: { id: req.params.id } });

    if (!spot) {
      return res.status(404).json({ error: 'Spot not found' });
    }

    if (spot.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own spots' });
    }

    await prisma.hiddenSpot.delete({ where: { id: req.params.id } });
    res.json({ message: 'Spot deleted successfully' });
  } catch (error) {
    console.error('Delete spot error:', error);
    res.status(500).json({ error: 'Failed to delete spot' });
  }
}
