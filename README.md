# 🛍️ Maison Luxe — Full Stack E-Commerce Platform

A production-grade luxury e-commerce application built with React, Node.js, PostgreSQL, Redis, Stripe, and Cloudinary.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TailwindCSS, Zustand, React Router v6 |
| Backend | Node.js, Express.js, Prisma ORM |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | JWT + bcrypt + HTTP-only cookies |
| Payments | Stripe |
| Storage | Cloudinary |
| Email | SendGrid / Nodemailer |
| DevOps | Docker + Docker Compose + Nginx |

## Quick Start

```bash
# 1. Clone & configure
git clone <repo-url> maison-luxe
cd maison-luxe
cp .env.example .env
# Edit .env with your credentials

# 2. Install dependencies
cd server && npm install && cd ..
cd client && npm install && cd ..

# 3. Start infrastructure
docker-compose up postgres redis -d

# 4. Setup database
cd server
npx prisma migrate dev --name init
node prisma/seed.js

# 5. Start development servers
# Terminal 1:
cd server && npm run dev

# Terminal 2:
cd client && npm run dev
```

Visit:
- Frontend: http://localhost:5173
- API: http://localhost:5000/api
- Admin: http://localhost:5173/admin (seed creates admin@maisonluxe.com / Admin123!)

## Production Deployment

```bash
docker-compose up -d --build
```

## Project Structure

```
maison-luxe/
├── client/          # React frontend
├── server/          # Express API
├── database/        # SQL init scripts
├── nginx/           # Reverse proxy config
├── docker-compose.yml
└── .env.example
```

## API Documentation

Full REST API available at `/api` — see `server/src/routes/` for all endpoints.

## Features

- ✅ User auth (register, login, JWT refresh)
- ✅ Product catalog with filtering, sorting, pagination
- ✅ Categories with nested subcategories
- ✅ Shopping cart (persistent, server-synced)
- ✅ Wishlist
- ✅ Stripe checkout with webhooks
- ✅ Order tracking & history
- ✅ Product reviews & ratings
- ✅ Image upload to Cloudinary
- ✅ Admin dashboard (products, orders, users, analytics)
- ✅ Email notifications (order confirmation, shipping)
- ✅ Redis caching & rate limiting
- ✅ Dockerized for production
