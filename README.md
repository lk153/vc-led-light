# LuminaLED - LED Light E-Commerce

A full-featured LED lighting e-commerce website built with Next.js, featuring 13 pages covering browsing, checkout, account management, and customer support.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL 16 (Supabase in production, Docker locally)
- **ORM**: Prisma 7
- **Auth**: NextAuth.js v5 (credentials login)
- **Validation**: Zod
- **Icons**: Material Symbols Outlined
- **i18n**: English & Vietnamese

## Pages

| Page | Route |
|------|-------|
| Home (LED Showroom) | `/` |
| Login & Registration | `/login` |
| Product Search & Filters | `/products` |
| Product Detail | `/products/[id]` |
| Cart Summary | `/cart` |
| Shipping | `/checkout/shipping` |
| Billing | `/checkout/billing` |
| Payment | `/checkout/payment` |
| Order Confirmation | `/order-confirmation` |
| User Profile | `/account` |
| Order History | `/account/orders` |
| Wishlist | `/account/wishlist` |
| Help & Support | `/support` |

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for local PostgreSQL)

### Setup

```bash
# Install dependencies
npm install

# Start PostgreSQL
docker-compose up -d

# Run database migrations
npx prisma migrate dev

# Seed sample data
npm run db:seed

# Start dev server (port 4000)
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```
DATABASE_URL="postgresql://luminaled:luminaled@localhost:5433/luminaled"
NEXTAUTH_URL="http://localhost:4000"
NEXTAUTH_SECRET="generate-a-random-secret-here"
```

## Deployment

Deployed on **Vercel** with Supabase PostgreSQL. Set `DATABASE_URL` and `NEXTAUTH_SECRET` in Vercel environment variables.

```bash
npm run build
```

## License

[MIT](LICENSE)
