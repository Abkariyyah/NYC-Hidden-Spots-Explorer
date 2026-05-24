import prisma from '../utils/prisma.js';

export async function createReview(req, res) {
  try {
    const { rating, comment } = req.body;
    const hiddenSpotId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    if (!comment?.trim()) {
      return res.status(400).json({ error: 'Comment is required' });
    }

    const spot = await prisma.hiddenSpot.findUnique({ where: { id: hiddenSpotId } });
    if (!spot) {
      return res.status(404).json({ error: 'Spot not found' });
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating, 10),
        comment: comment.trim(),
        userId: req.user.id,
        hiddenSpotId,
      },
      include: { user: { select: { id: true, name: true } } },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
}

export async function updateReview(req, res) {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    if (!comment?.trim()) {
      return res.status(400).json({ error: 'Comment is required' });
    }

    const review = await prisma.review.findUnique({ where: { id: req.params.id } });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own reviews' });
    }

    const updated = await prisma.review.update({
      where: { id: req.params.id },
      data: {
        rating: parseInt(rating, 10),
        comment: comment.trim(),
      },
      include: { user: { select: { id: true, name: true } } },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
}

export async function deleteReview(req, res) {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own reviews' });
    }

    await prisma.review.delete({ where: { id: req.params.id } });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
}
