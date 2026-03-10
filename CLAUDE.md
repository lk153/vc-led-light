# LuminaLED - Technical Design Document

## 1. Project Overview

LED light e-commerce website with 13 pages covering the full shopping experience: browsing, product details, checkout flow, user account management, and customer support.

- **PRD**: `Plan.MD`
- **UI/UX Designs**: `design/led-light/<page_folder>/` (each contains `screen.png` + `code.html`)
- **Deployment Target**: Vercel

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Font | Inter (via `next/font/google`) |
| Icons | Material Symbols Outlined (Google Fonts) |
| ORM | Prisma |
| Database | PostgreSQL 16 (Vercel Postgres / Neon in production, Docker in local dev) |
| Auth | NextAuth.js v5 (Auth.js) |
| Validation | Zod |
| Forms | Server Actions + `useFormState` |
| Package Manager | pnpm |

### Why This Stack

- **Simple and readable** is the top priority
- **No separate backend** - Next.js Server Actions and Server Components handle all data fetching and mutations
- **No client state library** - Server Components fetch data directly from DB via Prisma; no Zustand/Redux needed
- **No Redis** - Vercel handles caching; NextAuth manages sessions via DB adapter
- **No React Hook Form** - Server Actions + Zod validation is simpler for this project scope

---

## 3. Design System

Extracted from the design HTML reference files. All pages follow these conventions:

```
Primary Color:      #2b8cee
Background Light:   #f6f7f8
Background Dark:    #101922
Font Family:        Inter
Icons:              Material Symbols Outlined
Dark Mode:          Class-based toggle
Border Radius:      DEFAULT 0.25rem, lg 0.5rem, xl 0.75rem, full 9999px
```

### Tailwind Config Overrides

```ts
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        primary: "#2b8cee",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
    },
  },
}
```

### Shared UI Components (extract from designs)

- **Header**: Sticky top nav with logo, search bar, nav links, cart icon (with badge), profile avatar
- **Footer**: 4-column grid (brand, shop links, support links, newsletter signup) + copyright bar
- **ProductCard**: Image with hover zoom, badge (Sale/New/Stock status), rating, price, Add to Cart
- **OrderSummary**: Sidebar card with line items, subtotal, shipping, tax, total, CTA button
- **CheckoutStepper**: Step indicators (Cart -> Shipping -> Billing -> Payment)
- **FormInput**: Label + input with consistent rounded-lg borders, focus ring primary color

---

## 4. Project Structure

```
vc-led-light/
  CLAUDE.md                         # This file
  Plan.MD                           # PRD
  design/led-light/                 # UI/UX reference designs

  docker-compose.yml                # Local dev: PostgreSQL
  .env.local                        # Local environment variables
  .env.example                      # Template for env vars

  prisma/
    schema.prisma                   # Database schema
    seed.ts                         # Seed data (sample products, categories, users)

  src/
    app/
      layout.tsx                    # Root layout (header, footer, fonts, providers)
      page.tsx                      # Home - LED Showroom
      login/
        page.tsx                    # Login & Registration
      products/
        page.tsx                    # Product Search & Filters
        [id]/
          page.tsx                  # Product Detail Page
      cart/
        page.tsx                    # Checkout Cart Summary
      checkout/
        shipping/
          page.tsx                  # Shipping Information
        billing/
          page.tsx                  # Billing Information
        payment/
          page.tsx                  # Payment Method Selection
      order-confirmation/
        page.tsx                    # Order Success Confirmation
      account/
        page.tsx                    # User Profile Dashboard
        orders/
          page.tsx                  # Order History List
        wishlist/
          page.tsx                  # Product Wishlist Page
      support/
        page.tsx                    # Customer Help & Support Center
      api/
        auth/[...nextauth]/
          route.ts                  # NextAuth API route

    components/
      layout/
        header.tsx                  # Sticky top navigation bar
        footer.tsx                  # Site-wide footer
        mobile-nav.tsx              # Mobile hamburger menu
      ui/
        button.tsx
        input.tsx
        select.tsx
        card.tsx
        badge.tsx
        stepper.tsx                 # Checkout progress stepper
        modal.tsx
        accordion.tsx               # FAQ accordion (support page)
      product/
        product-card.tsx
        product-grid.tsx
        product-gallery.tsx         # Image gallery (detail page)
        product-filters.tsx         # Sidebar filters
        product-reviews.tsx
      checkout/
        order-summary.tsx           # Reused across cart/shipping/billing/payment
        cart-item.tsx
        promo-code.tsx
      account/
        sidebar-nav.tsx             # Profile sidebar navigation
        stats-widget.tsx            # Order/points stat cards

    actions/
      auth.ts                       # Login, register, logout
      cart.ts                       # Add/remove/update cart items
      checkout.ts                   # Shipping, billing, payment submission
      orders.ts                     # Place order, get order history
      products.ts                   # Search, filter products
      wishlist.ts                   # Add/remove wishlist items
      profile.ts                    # Update profile, addresses

    lib/
      prisma.ts                     # Prisma client singleton
      auth.ts                       # NextAuth configuration
      validations.ts                # Zod schemas (shared between actions and forms)
      utils.ts                      # Format currency, dates, etc.
      constants.ts                  # Site config, nav links

    types/
      index.ts                      # Shared TypeScript types/interfaces
```

---

## 5. Pages & Route Mapping

| # | Page (from PRD) | Route | Design Reference | Rendering |
|---|----------------|-------|-----------------|-----------|
| 1 | Login and Registration | `/login` | `login_and_registration/` | Client Component (form interactions) |
| 2 | LED Showroom Home Page | `/` | `led_showroom_home_page/` | Server Component (SSG/ISR) |
| 3 | Product Search and Filters | `/products` | `product_search_and_filters/` | Server Component + client filters |
| 4 | Checkout Cart Summary | `/cart` | `checkout_cart_summary/` | Client Component (cart state) |
| 5 | Shipping Information | `/checkout/shipping` | `shipping_information/` | Server Action form |
| 6 | Billing Information | `/checkout/billing` | `billing_information/` | Server Action form |
| 7 | Payment Method Selection | `/checkout/payment` | `payment_method_selection/` | Client Component (card input) |
| 8 | Order Success Confirmation | `/order-confirmation` | `order_success_confirmation/` | Server Component |
| 9 | Product Detail Page | `/products/[id]` | `product_detail_page/` | Server Component (SSG/ISR) |
| 10 | User Profile Dashboard | `/account` | `user_profile_dashboard/` | Server Component (auth protected) |
| 11 | Order History List | `/account/orders` | `order_history_list/` | Server Component (auth protected) |
| 12 | Product Wishlist Page | `/account/wishlist` | `product_wishlist/` | Server Component (auth protected) |
| 13 | Customer Help & Support Center | `/support` | `customer_help_and_support_center/` | Server Component (SSG) |

---

## 6. Database Schema

### Entity Relationship

```
User 1--* Address
User 1--1 Cart
User 1--* Order
User 1--* Review
User 1--* WishlistItem

Category 1--* Product
Product 1--* ProductImage
Product 1--* Review
Product 1--* WishlistItem
Product 1--* CartItem
Product 1--* OrderItem

Cart 1--* CartItem
Order 1--* OrderItem
Order 1--1 ShippingAddress (snapshot)
Order 1--1 BillingAddress (snapshot)
```

### Prisma Models

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  passwordHash  String?
  phone         String?
  image         String?
  accountType   String    @default("individual")
  membershipTier String   @default("gold")
  rewardPoints  Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  addresses     Address[]
  cart          Cart?
  orders        Order[]
  reviews       Review[]
  wishlistItems WishlistItem[]
  accounts      Account[]
  sessions      Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Address {
  id         String  @id @default(cuid())
  userId     String
  label      String  @default("Home")
  firstName  String
  lastName   String
  street     String
  apartment  String?
  city       String
  state      String
  zipCode    String
  country    String  @default("US")
  phone      String?
  isDefault  Boolean @default(false)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  icon        String?
  products    Product[]
}

model Product {
  id               String   @id @default(cuid())
  name             String
  slug             String   @unique
  description      String?
  shortDescription String?
  sku              String   @unique
  price            Decimal  @db.Decimal(10, 2)
  compareAtPrice   Decimal? @db.Decimal(10, 2)
  categoryId       String
  brand            String?
  wattage          Int?
  lumens           Int?
  colorTemperature String?
  lifespan         Int?
  cri              Int?
  stock            Int      @default(0)
  featured         Boolean  @default(false)
  rating           Decimal  @default(0) @db.Decimal(2, 1)
  reviewCount      Int      @default(0)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  category      Category       @relation(fields: [categoryId], references: [id])
  images        ProductImage[]
  reviews       Review[]
  wishlistItems WishlistItem[]
  cartItems     CartItem[]
  orderItems    OrderItem[]
}

model ProductImage {
  id        String  @id @default(cuid())
  productId String
  url       String
  alt       String?
  position  Int     @default(0)

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique
  updatedAt DateTime   @updatedAt

  user  User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items CartItem[]
}

model CartItem {
  id        String @id @default(cuid())
  cartId    String
  productId String
  quantity  Int    @default(1)

  cart    Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])

  @@unique([cartId, productId])
}

model Order {
  id              String   @id @default(cuid())
  orderNumber     String   @unique
  userId          String
  status          String   @default("processing")
  subtotal        Decimal  @db.Decimal(10, 2)
  shippingCost    Decimal  @default(0) @db.Decimal(10, 2)
  tax             Decimal  @default(0) @db.Decimal(10, 2)
  total           Decimal  @db.Decimal(10, 2)
  promoCode       String?
  discount        Decimal  @default(0) @db.Decimal(10, 2)
  shippingName    String
  shippingStreet  String
  shippingCity    String
  shippingState   String
  shippingZip     String
  shippingCountry String   @default("US")
  billingName     String?
  billingStreet   String?
  billingCity     String?
  billingState    String?
  billingZip      String?
  billingCountry  String?
  paymentMethod   String
  paymentLast4    String?
  estimatedDelivery DateTime?
  deliveredAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user  User        @relation(fields: [userId], references: [id])
  items OrderItem[]
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  name      String
  price     Decimal @db.Decimal(10, 2)
  quantity  Int
  imageUrl  String?

  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])
}

model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  productId String
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])

  @@unique([userId, productId])
}

model Review {
  id        String   @id @default(cuid())
  userId    String
  productId String
  rating    Int
  title     String?
  body      String?
  verified  Boolean  @default(false)
  createdAt DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@unique([userId, productId])
}

model PromoCode {
  id            String   @id @default(cuid())
  code          String   @unique
  discountType  String
  discountValue Decimal  @db.Decimal(10, 2)
  minOrder      Decimal? @db.Decimal(10, 2)
  maxUses       Int?
  usedCount     Int      @default(0)
  active        Boolean  @default(true)
  expiresAt     DateTime?
}
```

---

## 7. Authentication

Using NextAuth.js v5 with:

- **Credentials provider**: Email + password (bcrypt hashed)
- **Google OAuth provider**: Social login
- **Apple OAuth provider**: Social login
- **Session strategy**: JWT (works best with Vercel serverless)
- **Prisma adapter**: For storing accounts, sessions, verification tokens

Protected routes (middleware):
- `/account/*` - requires auth
- `/checkout/*` - requires auth
- `/cart` - works without auth (guest cart via cookies), merges on login

---

## 8. Local Development

### docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: luminaled
      POSTGRES_PASSWORD: luminaled
      POSTGRES_DB: luminaled
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@luminaled.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

### Environment Variables (.env.local)

```
DATABASE_URL="postgresql://luminaled:luminaled@localhost:5432/luminaled"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
APPLE_CLIENT_ID=""
APPLE_CLIENT_SECRET=""
```

### Dev Workflow

```bash
docker compose up -d          # Start PostgreSQL + pgAdmin
pnpm install                  # Install dependencies
pnpm prisma migrate dev       # Run migrations
pnpm prisma db seed           # Seed sample data
pnpm dev                      # Start Next.js dev server at localhost:3000
```

---

## 9. Vercel Deployment

- **Database**: Vercel Postgres (Neon) - set `DATABASE_URL` in Vercel env vars
- **Build**: `pnpm build` (runs `prisma generate` as part of build)
- **Environment**: Set `NEXTAUTH_SECRET`, OAuth credentials in Vercel dashboard
- **Prisma**: Add `prisma generate` to `postinstall` script in `package.json`

---

## 10. Coding Conventions

- **File naming**: kebab-case for all files (`product-card.tsx`, `order-summary.tsx`)
- **Component naming**: PascalCase for components (`ProductCard`, `OrderSummary`)
- **Server vs Client**: Default to Server Components. Add `"use client"` only when needed (forms with interactivity, event handlers)
- **Data fetching**: Server Components call Prisma directly. No unnecessary API routes.
- **Mutations**: Use Server Actions (`"use server"`) for all form submissions and data mutations
- **Validation**: Define Zod schemas in `lib/validations.ts`, reuse in both Server Actions and client-side forms
- **Error handling**: Use `try/catch` in Server Actions, return `{ error: string }` or `{ success: true, data }` pattern
- **Styling**: Use Tailwind utility classes directly. Extract components rather than creating custom CSS classes.
- **Imports**: Use `@/` path alias for `src/` directory

---

## 11. Build Order

Phase 1 - Foundation:
1. Project scaffolding (Next.js, Tailwind, Prisma)
2. docker-compose + database setup
3. Prisma schema + migrations + seed data
4. Shared layout (header, footer)
5. Auth (NextAuth setup, login page)

Phase 2 - Shopping:
6. Home page (LED Showroom)
7. Product Search & Filters page
8. Product Detail page

Phase 3 - Checkout:
9. Cart page
10. Shipping page
11. Billing page
12. Payment page
13. Order Confirmation page

Phase 4 - Account:
14. User Profile Dashboard
15. Order History
16. Product Wishlist

Phase 5 - Support:
17. Help & Support Center
