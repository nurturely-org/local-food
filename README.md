# Local Food Co-op — Presque Isle County

A hyper-local marketplace that lets shoppers browse, reserve, and pick up fresh food directly from backyard gardeners, homesteaders, and hobby farms in Presque Isle County, Michigan.

## Stack

- **Frontend:** Vite + React + Tailwind CSS v4
- **Backend:** Express + better-sqlite3
- **Persistence:** SQLite database

## Quick Start

### 1. Install dependencies

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 2. Start the backend API

```bash
cd backend
npm start
```

The API runs at http://127.0.0.1:8000 and auto-seeds the database on first run.

### 3. Start the frontend dev server

```bash
cd frontend
npm run dev
```

The app runs at http://localhost:3000 (or the proxied address) and forwards `/api` requests to the backend.

## Project Structure

```
local-food/
├── frontend/                # Vite + React SPA
│   ├── src/
│   │   ├── App.jsx          # Main application with all views
│   │   ├── App.css
│   │   ├── index.css        # Tailwind imports
│   │   └── main.jsx         # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/                 # Express API server
│   ├── src/
│   │   ├── server.js        # Entry point
│   │   ├── database.js      # SQLite schema & connection
│   │   ├── seed.js          # Seed data (Presque Isle Co-op)
│   │   └── routes/
│   │       ├── farms.js     # /api/farms
│   │       ├── products.js  # /api/products
│   │       └── reservations.js # /api/reservations
│   ├── database.sqlite      # SQLite database file
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/farms | List all active farms |
| GET | /api/farms/:id | Farm details with products |
| GET | /api/products | List products (filterable) |
| GET | /api/products/categories | List product categories |
| GET | /api/products/:id | Product details |
| POST | /api/reservations | Create a reservation |
| GET | /api/reservations?email= | List reservations by email |
| GET | /api/reservations/:id | Reservation details |

## Seed Data

Includes 5 farms and 21 products representing the Presque Isle County Food Co-op:

- **Bonz Beach Farms** — Heirloom tomatoes, sweet corn, vegetables
- **Johnson Family Homestead** — Pasture-raised eggs, preserves, kale
- **North Woods Apiary** — Raw honey, beeswax candles, lip balm
- **Posen Potato Patch** — Specialty potatoes, root vegetables
- **Lake Esau Berry Farm** — Strawberries, blueberries, jams
