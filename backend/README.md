# NYC Hidden Spots Explorer — Backend

Express + Prisma API for the NYC Hidden Spots Explorer app.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file and edit values:

```bash
cp .env.example .env
```

3. Run Prisma migrations and generate client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. (Optional) Seed sample data:

```bash
npm run db:seed
```

5. Start the development server:

```bash
npm run dev
```

The API runs at `http://localhost:5001` by default.

## Environment Variables

| Variable       | Description                          |
|----------------|--------------------------------------|
| `DATABASE_URL` | SQLite path, e.g. `file:./dev.db`    |
| `JWT_SECRET`   | Secret for signing JWT tokens        |
| `PORT`         | Server port (default 5001)           |

## API Routes

- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login, returns JWT
- `GET /api/auth/me` — Current user (protected)
- `GET /api/spots` — List spots (query: category, borough, priceRange, search)
- `GET /api/spots/trending` — Top trending spots
- `GET /api/spots/:id` — Single spot with reviews
- `POST /api/spots` — Create spot (protected)
- `PUT /api/spots/:id` — Update own spot (protected)
- `DELETE /api/spots/:id` — Delete own spot (protected)
- `POST /api/spots/:id/reviews` — Add review (protected)
- `PUT /api/reviews/:id` — Update own review (protected)
- `DELETE /api/reviews/:id` — Delete own review (protected)
- `GET /api/saved` — User's saved spots (protected)
- `POST /api/spots/:id/save` — Save spot (protected)
- `DELETE /api/spots/:id/save` — Unsave spot (protected)

## Demo Account (after seed)

- Email: `demo@example.com`
- Password: `password123`
