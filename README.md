# E-Commerce Platform

A full-featured e-commerce store built with Next.js, featuring a customer-facing storefront and an admin dashboard.

## Features

- **Storefront** — Product catalog with grid/list views, category browsing, search, filtering, product detail pages with reviews/ratings, wishlist, cart, and checkout
- **Admin Dashboard** — Product, order, category, and user management with analytics
- **Authentication** — Email/password (NextAuth v5) with Google OAuth, role-based access (user/admin)
- **Database** — PostgreSQL via Drizzle ORM with Neon serverless driver
- **Modern UI** — Tailwind CSS 4 + DaisyUI 5, responsive design, dark mode

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js](https://nextjs.org) 16 (Partial Prerendering) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + DaisyUI 5 |
| Database | PostgreSQL (Neon) |
| ORM | Drizzle ORM |
| Auth | NextAuth v5 (Credentials + Google) |
| Forms | React Hook Form + Zod |
| Payments | _[integrate your provider]_ |
| Image Hosting | Cloudinary |

## Quick Start

### Prerequisites

- Node.js 20+
- A PostgreSQL database (local or [Neon](https://neon.tech))

### Setup

```bash
git clone <repo-url>
cd ecom-platform
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth secret (`openssl rand -base64 32`) |
| `AUTH_URL` | App URL (`http://localhost:3000` for dev) |
| `AUTH_GOOGLE_ID` | Google OAuth client ID (optional) |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret (optional) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (optional) |
| `CLOUDINARY_API_KEY` | Cloudinary API key (optional) |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (optional) |

### Database

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed with sample data (80 products, 10 categories, reviews, admin user)
npm run db:seed
```

The seed creates an admin account: `admin@example.com` / `admin123`.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── actions/         # Server Actions (auth, admin)
├── app/             # Next.js App Router pages
│   ├── (auth)/      # Login / Register
│   ├── (public)/    # Storefront
│   └── admin/       # Admin dashboard
├── components/      # Reusable React components
├── constants/       # Route definitions, site config
├── data/            # Static data (testimonials, filter options)
├── db/              # Schema, migrations, seed
├── hooks/           # React hooks (useFilters, etc.)
├── lib/             # Utilities (auth config, SEO, JSON-LD)
├── services/        # Server-only DB services
└── types/           # TypeScript types
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Apply migrations to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Drizzle Studio |

## Deploy on Vercel

The project is configured for Vercel deployment with Partial Prerendering (PPR) enabled.

1. Push your repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Set all environment variables from `.env.example`
4. Deploy

Migrations can be run as a post-deploy step:
```bash
npm run db:migrate
npm run db:seed
```

## Notes

- PPR is enabled — pages that use DB queries call `cookies()` to signal dynamic rendering (compatibility with Neon's WebSocket-based driver)
- Admin panel is at `/admin` — only accessible with the `admin` role
