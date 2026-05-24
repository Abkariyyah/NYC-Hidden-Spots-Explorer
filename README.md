# NYC Hidden Spots Explorer

**Contributors:** Abkariyyah Ahmed and Lal Karim  
**Course:** Practical Web Development — Final Project

## Project Description

NYC Hidden Spots Explorer is a full-stack CRUD web application where users discover, create, save, review, edit, and delete underrated places around New York City — cafes, bookstores, parks, study spots, halal food, sunset viewpoints, and more. Users can browse spots with filters, view details with maps, save favorites, and leave reviews. Each hidden spot and review belongs to the user who created it, and only owners can edit or delete their own content.

## Target Audience

- NYC students and residents looking for lesser-known places
- Food and coffee enthusiasts
- Anyone who wants to share local gems instead of mainstream tourist spots

## User Stories

1. As a visitor, I want to browse hidden spots so I can discover new places.
2. As a user, I want to sign up and log in so I can contribute to the community.
3. As a logged-in user, I want to add a hidden spot with location details so others can find it.
4. As a user, I want to filter spots by category, borough, and price so I can narrow my search.
5. As a user, I want to view a spot on a map so I know where it is.
6. As a user, I want to leave a review so I can share my experience.
7. As a user, I want to save spots so I can revisit them later.
8. As a spot owner, I want to edit or delete only my own spots so my content stays accurate.
9. As a visitor, I want to see trending spots on the home page so I find popular gems quickly.

## Advanced Features

1. **Interactive Map with Pins (Leaflet + OpenStreetMap)** — Shows all spots on the Browse page and a single location on the detail page. No API key required.
2. **Trending Places Algorithm** — Backend ranks spots with `trendingScore = averageRating × 2 + saveCount`. The home page displays the top results.

## Models and Fields

| Model       | Fields |
|------------|--------|
| **User**   | id, name, email, password, createdAt, updatedAt |
| **HiddenSpot** | id, name, description, category, borough, address, latitude, longitude, priceRange, imageUrl, createdAt, updatedAt, userId |
| **Review** | id, rating, comment, createdAt, updatedAt, userId, hiddenSpotId |
| **SavedSpot** | id, userId, hiddenSpotId, createdAt |

## Database Relationships

- One **User** → many **HiddenSpots**, **Reviews**, **SavedSpots**
- One **HiddenSpot** → one **User** (owner); many **Reviews** and **SavedSpots**
- **SavedSpot** links **User** and **HiddenSpot** (many-to-many)

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + Vite | UI and routing |
| Frontend | React Router | Page navigation |
| Frontend | Axios | API requests |
| Frontend | Tailwind CSS | Styling |
| Frontend | React Hook Form | Form validation |
| Frontend | Leaflet + react-leaflet | Maps |
| Backend | Node.js + Express | REST API |
| Backend | Prisma | ORM and migrations |
| Backend | SQLite | Local database |
| Backend | bcrypt | Password hashing |
| Backend | jsonwebtoken | Auth tokens |

## Project Structure

```
WebdevFinalProject/
├── backend/          # Express API
├── frontend/         # React app
└── README.md         # This file
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set JWT_SECRET to any long random string

npx prisma migrate dev --name init
npx prisma generate
npm run db:seed    # optional sample data
npm run dev
```

API: `http://localhost:5001`

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App: `http://localhost:5173`

## Environment Variables

**Backend (`backend/.env`):**

- `DATABASE_URL` — e.g. `file:./dev.db`
- `JWT_SECRET` — secret for JWT signing
- `PORT` — default `5001`

**Frontend (`frontend/.env`):**

- `VITE_API_URL` — e.g. `http://localhost:5001/api`

## Demo Account (after seed)

- Email: `demo@example.com`
- Password: `password123`

## Problem Encountered & Solution

When we first added the trending route as `GET /api/spots/:id`, requests to `/api/spots/trending` were treated as if `"trending"` was a spot ID, which returned 404. We fixed this by defining the `/trending` route **before** the `/:id` route in Express, so more specific paths are matched first. The same idea applies on the React side: `/spots/new` must be registered before `/spots/:id` so `"new"` is not parsed as an ID.

## Individual Contributions

### Abkariyyah Ahmed

I worked on the backend functionality and overall application structure for the project. I helped implement authentication using JWT and bcrypt, created several API routes with Express, and designed the Prisma database models and relationships. I also worked on integrating the interactive map feature and making sure users could properly create, edit, delete, save, and review hidden spots. One challenge I came across was managing protected routes and making sure users could only modify their own content, but after debugging middleware and testing endpoints carefully, I was able to get the authorization system working correctly. Through this project, I learned a lot more about how frontend and backend systems communicate in a full-stack application and how important clean organization is when working on a larger project.

### Lal Karim

I focused on the frontend development and improving the user experience of the application. I worked on building several React pages and reusable components, styling the application with Tailwind CSS, and implementing features such as filtering hidden spots, displaying reviews, and showing trending locations on the homepage. I also helped connect the frontend to backend API routes using Axios and tested many of the CRUD features to make sure they worked smoothly. One challenge I faced was handling state updates across different pages after creating or editing spots, but working through that helped me better understand React state management and routing. This project helped me gain more confidence building a complete full-stack application from start to finish.
