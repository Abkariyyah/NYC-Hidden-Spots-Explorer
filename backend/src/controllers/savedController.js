import prisma from '../utils/prisma.js';
import { enrichSpot } from '../utils/spotHelpers.js';

const spotInclude = {
  user: { select: { id: true, name: true, email: true } },
  reviews: true,
  _count: { select: { savedSpots: true } },
};

export async function getSavedSpots(req, res) {
  try {
    const saved = await prisma.savedSpot.findMany({
      where: { userId: req.user.id },
      include: {
        hiddenSpot: { include: spotInclude },
      },
      orderBy: { createdAt: 'desc' },
    });

    const spots = saved.map((s) => enrichSpot(s.hiddenSpot));
    res.json(spots);
  } catch (error) {
    console.error('Get saved error:', error);
    res.status(500).json({ error: 'Failed to fetch saved spots' });
  }
}

export async function saveSpot(req, res) {
  try {
    const hiddenSpotId = req.params.id;

    const spot = await prisma.hiddenSpot.findUnique({ where: { id: hiddenSpotId } });
    if (!spot) {
      return res.status(404).json({ error: 'Spot not found' });
    }

    const existing = await prisma.savedSpot.findUnique({
      where: {
        userId_hiddenSpotId: {
          userId: req.user.id,
          hiddenSpotId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Spot already saved' });
    }

    await prisma.savedSpot.create({
      data: { userId: req.user.id, hiddenSpotId },
    });

    res.status(201).json({ message: 'Spot saved successfully' });
  } catch (error) {
    console.error('Save spot error:', error);
    res.status(500).json({ error: 'Failed to save spot' });
  }
}

export async function unsaveSpot(req, res) {
  try {
    const hiddenSpotId = req.params.id;

    const saved = await prisma.savedSpot.findUnique({
      where: {
        userId_hiddenSpotId: {
          userId: req.user.id,
          hiddenSpotId,
        },
      },
    });

    if (!saved) {
      return res.status(404).json({ error: 'Saved spot not found' });
    }

    await prisma.savedSpot.delete({ where: { id: saved.id } });
    res.json({ message: 'Spot removed from saved list' });
  } catch (error) {
    console.error('Unsave spot error:', error);
    res.status(500).json({ error: 'Failed to unsave spot' });
  }
}
