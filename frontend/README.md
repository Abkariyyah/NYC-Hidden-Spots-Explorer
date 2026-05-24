# NYC Hidden Spots Explorer — Frontend

React + Vite frontend for browsing and managing hidden NYC spots.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
cp .env.example .env
```

3. Start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`. Make sure the backend API is running on port 5001.

## Environment Variables

| Variable        | Description                    |
|-----------------|--------------------------------|
| `VITE_API_URL`  | Backend API base URL           |

Example: `VITE_API_URL=http://localhost:5001/api`
