/**
 * Production start script for Railway/Render.
 * Picks SQLite or PostgreSQL schema based on DATABASE_URL,
 * creates tables, seeds if empty, then starts the server.
 */
import { execSync } from 'child_process';
import { copyFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dbUrl = process.env.DATABASE_URL || '';

if (!dbUrl) {
  console.error('DATABASE_URL is missing. Add it in Railway Variables.');
  process.exit(1);
}

const isPostgres = dbUrl.startsWith('postgres');

console.log(`Database mode: ${isPostgres ? 'PostgreSQL' : 'SQLite'}`);

if (isPostgres) {
  copyFileSync(
    join(root, 'prisma/schema.postgresql.prisma'),
    join(root, 'prisma/schema.prisma')
  );
} else {
  copyFileSync(
    join(root, 'prisma/schema.sqlite.prisma'),
    join(root, 'prisma/schema.prisma')
  );
}

process.chdir(root);

try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  execSync('node prisma/seed.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Database setup failed.');
  process.exit(1);
}

execSync('node src/server.js', { stdio: 'inherit' });
