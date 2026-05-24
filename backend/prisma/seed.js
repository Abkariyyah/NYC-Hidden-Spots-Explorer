import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const sampleSpots = [
  {
    name: 'Devoción Coffee',
    description: 'A stunning Colombian coffee shop in Williamsburg with a lush indoor garden and excellent espresso.',
    category: 'Cafe',
    borough: 'Brooklyn',
    address: '69 Grand St, Brooklyn, NY',
    latitude: 40.7163,
    longitude: -73.9612,
    priceRange: '$$',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
  },
  {
    name: 'The Strand Bookstore',
    description: 'Iconic 18 miles of books — but head upstairs for lesser-known indie titles and quiet corners.',
    category: 'Bookstore',
    borough: 'Manhattan',
    address: '828 Broadway, New York, NY',
    latitude: 40.7334,
    longitude: -73.9904,
    priceRange: '$',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
  },
  {
    name: 'Brooklyn Bridge Park Pier 1',
    description: 'Perfect sunset viewpoint with Manhattan skyline views. Bring a blanket and snacks.',
    category: 'Sunset Viewpoint',
    borough: 'Brooklyn',
    address: 'Brooklyn Bridge Park, Brooklyn, NY',
    latitude: 40.7024,
    longitude: -73.9965,
    priceRange: 'Free',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600',
  },
  {
    name: 'NYU Bobst Library',
    description: 'Quiet study floors with iconic spiral stacks. Open to NYU students; visitors can use lower floors.',
    category: 'Study Spot',
    borough: 'Manhattan',
    address: '70 Washington Square S, New York, NY',
    latitude: 40.7295,
    longitude: -73.9965,
    priceRange: 'Free',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600',
  },
  {
    name: 'The Halal Guys',
    description: 'Famous chicken over rice cart — a NYC staple for late-night halal food on the go.',
    category: 'Halal Food',
    borough: 'Manhattan',
    address: '53rd St & 6th Ave, New York, NY',
    latitude: 40.7618,
    longitude: -73.9772,
    priceRange: '$',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
  },
  {
    name: 'Fort Tryon Park',
    description: 'Peaceful park in Upper Manhattan with The Cloisters nearby — great for walks and picnics.',
    category: 'Park',
    borough: 'Manhattan',
    address: 'Riverside Dr, New York, NY',
    latitude: 40.8612,
    longitude: -73.9326,
    priceRange: 'Free',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
  },
];

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'lal@example.com' },
    update: {},
    create: {
      name: 'Lal Karim',
      email: 'lal@example.com',
      password: hashedPassword,
    },
  });

  const existingCount = await prisma.hiddenSpot.count();
  if (existingCount === 0) {
    for (let i = 0; i < sampleSpots.length; i++) {
      const spot = await prisma.hiddenSpot.create({
        data: {
          ...sampleSpots[i],
          userId: i % 2 === 0 ? user1.id : user2.id,
        },
      });

      // Add a sample review and save for trending demo
      await prisma.review.create({
        data: {
          rating: 4 + (i % 2),
          comment: 'Great hidden gem! Definitely worth a visit.',
          userId: user1.id,
          hiddenSpotId: spot.id,
        },
      });

      if (i < 3) {
        await prisma.savedSpot.create({
          data: { userId: user2.id, hiddenSpotId: spot.id },
        });
      }
    }
    console.log('Seeded sample spots, reviews, and saves');
  } else {
    console.log('Database already has spots, skipping seed data');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
