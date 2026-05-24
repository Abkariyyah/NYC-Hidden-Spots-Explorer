// Helper to attach average rating and save count to a spot
export function enrichSpot(spot) {
  const reviews = spot.reviews || [];
  const saveCount = spot._count?.savedSpots ?? spot.savedSpots?.length ?? 0;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // Trending formula: averageRating * 2 + saveCount
  const trendingScore = averageRating * 2 + saveCount;

  const { password, ...userWithoutPassword } = spot.user || {};

  return {
    ...spot,
    user: spot.user ? userWithoutPassword : undefined,
    averageRating: Math.round(averageRating * 10) / 10,
    saveCount,
    trendingScore,
  };
}

export function stripPassword(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}
