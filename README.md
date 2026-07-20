# BookJournal

A full-stack reading journal: track your bookcase (Wishlist / Reading Now / Finished / Abandoned), search for books, write journal entries (characters, quotes, themes, notes), rate books, and view personal reading stats going back 5 years.

**Stack:** React (Vite) frontend · Node/Express backend · MongoDB · JWT auth (register/login)

## Project structure

```
book-journal/
  backend/     Express API + MongoDB models + JWT auth
  frontend/    React app (Vite)
```

## 1. Set up MongoDB

Use a local MongoDB (`brew install mongodb-community` or Docker: `docker run -d -p 27017:27017 mongo`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and grab its connection string.

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI and a real JWT_SECRET
npm install
npm run dev
```

The API runs at `http://localhost:5000`. Health check: `GET /api/health`.

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Open it, click **Register**, and create your account — you're in.

## Features implemented

- **Register / Sign in** — JWT auth, passwords hashed with bcrypt
- **Dashboard** — reading goal progress, shelf counts, recently added books
- **Book Search** — live search via the Open Library API, add straight to a shelf
- **MyBookcase** — Wishlist / Reading Now / Finished / Abandoned shelves, move books between them
- **Journal Entries** — per-book notes on characters, favorite quotes, plot, themes, and free-form notes; 5-star ratings; Fiction/Non-Fiction + genre tagging
- **Personal Stats** — books finished per year (last 5 years), Fiction vs Non-Fiction split, genre breakdown

## Notes on scaling this up

- **Leaderboard / activity feed / viewing other members' journals** from the original feature list need a public/friends layer (visibility settings, follow relationships) — the data model here is single-owner per book/journal, so this would be a follow-on iteration.
- For production: add rate limiting on `/api/auth`, email verification, password reset, and HTTPS-only cookies instead of a bearer token in localStorage if you want stronger XSS protection.
- Deploy target ideas: backend on Render/Fly.io/Railway with MongoDB Atlas; frontend on Vercel/Netlify (set `VITE_API_URL` to your deployed backend URL).
