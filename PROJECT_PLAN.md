# Next.js E-Commerce Portfolio Project Plan

> **Project Goal**
>
> Build a modern, production-quality e-commerce application that demonstrates strong frontend and full-stack engineering skills. The application should be portfolio-worthy for a frontend focused full-stack developer with approximately 2 years of experience.
>
> The project should prioritize clean architecture, maintainability, scalability, accessibility, and performance over unnecessary complexity.

---

# Tech Stack

## Framework

- Next.js 16
- App Router
- src directory structure
- React 19
- TypeScript (strict mode)

## Styling

- Tailwind CSS v4
- DaisyUI v5
- clsx
- tailwind-merge
- lucide-react

## Database

- Neon PostgreSQL
- Drizzle ORM
- Drizzle Kit

## Validation

- Zod

## Forms

- React Hook Form

## Authentication

Use Auth.js (NextAuth v5)

Authentication methods:

- Email/password
- Google OAuth

Roles:

- Customer
- Admin

---

# Rendering Strategy

Use Next.js rendering features appropriately.

## Static Generation (SSG)

Use SSG whenever data rarely changes.

Pages:

- Home
- Categories
- Product Categories
- About
- FAQ

---

## Dynamic Rendering (SSR)

Use SSR where fresh data is important.

Examples:

- Search page
- Cart page
- Checkout
- User Dashboard
- Orders
- Wishlist
- Admin Dashboard

---

## Dynamic Routes

- /products/[slug]
- /categories/[slug]
- /orders/[id]

---

---

## Metadata

Every page should have

- title
- description
- open graph
- twitter metadata

Use Next.js Metadata API.

---

# Application Features

---

# Public

## Home Page

Contains:

- Hero Banner
- Featured Products
- Best Sellers
- New Arrivals
- Featured Categories
- Promotional Banner
- Newsletter
- Customer Reviews
- Brand Logos

---

## Product Listing

Features

- Grid/List View
- Pagination
- Infinite Scroll (optional)
- Sorting

Sort options

- Price Low → High
- Price High → Low
- Newest
- Best Selling
- Rating

---

## Filtering

Multiple filters

- Category
- Brand
- Price Range
- Rating
- Stock
- Discount

Filters should synchronize with URL search params.

---

## Product Details

Include

Large gallery

- Multiple images

Product information

- Price
- Discount
- Description
- Specifications

Sections

- Reviews
- Related Products
- Frequently Bought Together

Actions

- Add to Cart
- Buy Now
- Wishlist

---

## Search

Global search

Features

- Search suggestions
- Debounce
- Empty states
- Recent searches
- URL synced

---

# Authentication

Customer can

- Register
- Login
- Logout
- Reset password

Protect dashboard routes.

---

# Customer Dashboard

Sections

## Profile

- Personal information
- Avatar
- Address

---

## Orders

Display

- Current orders
- Previous orders
- Order details

---

## Wishlist

- Add
- Remove
- Move to cart

---

## Saved Addresses

CRUD

---

# Shopping Cart

Features

Guest cart

Authenticated cart

Persist cart

Merge guest cart after login

---

Cart Item

- quantity
- subtotal
- remove
- update quantity

---

# Checkout

Steps

1 Shipping

2 Billing

3 Payment

4 Review

5 Success

---

Validation using

- Zod
- React Hook Form

---

Payment

No real payment gateway.

Simulate payment success.

---

# Reviews

Authenticated users only.

Capabilities

- Rating
- Comment
- Edit
- Delete

---

# Admin Panel

Role protected.

Sections

Dashboard

Products

Categories

Orders

Users

Reviews

Coupons

---

# Product Management

CRUD

Fields

- title
- slug
- description
- images
- stock
- price
- discount
- category
- brand
- featured

---

# Category Management

CRUD

---

# Coupon Management

CRUD

Coupon Types

- Percentage
- Fixed

Rules

- Expiration
- Usage limit
- Minimum purchase

---

# Order Management

Admin can

- Update status

Statuses

- Pending
- Paid
- Processing
- Shipped
- Delivered
- Cancelled

---

# User Management

Admin can

- View users
- Disable user
- Change role

---

# Database Design

---

## users

- id
- name
- email
- password
- image
- role
- createdAt

---

## categories

- id
- name
- slug
- image

---

## products

- id
- title
- slug
- description
- categoryId
- brand
- price
- discount
- stock
- featured
- createdAt

---

## productImages

- id
- productId
- imageUrl

---

## cartItems

- id
- userId
- productId
- quantity

---

## wishlist

- id
- userId
- productId

---

## orders

- id
- userId
- total
- status
- paymentStatus
- createdAt

---

## orderItems

- id
- orderId
- productId
- quantity
- price

---

## reviews

- id
- userId
- productId
- rating
- comment

---

## addresses

- id
- userId
- address
- city
- country
- postalCode

---

## coupons

- id
- code
- type
- value
- expirationDate
- usageLimit

---

# Folder Structure

src
│
├── app
│
├── components
│ ├── ui
│ ├── layout
│ ├── products
│ ├── cart
│ ├── checkout
│ ├── dashboard
│ ├── admin
│ └── shared
│
├── db
│ ├── schema
│ ├── migrations
│ └── index.ts
│
├── actions
│
├── hooks
│
├── lib
│
├── services
│
├── types
│
├── utils
│
├── constants
│
├── providers
│
└── middleware.ts

---

# Route Structure

- /products
- /products/[slug]
- /categories
- /categories/[slug]
- /search
- /cart
- /checkout
- /login
- /register
- /dashboard
- /dashboard/orders
- /dashboard/profile
- /dashboard/wishlist
- /admin
- /admin/products
- /admin/categories
- /admin/orders
- /admin/users
- /admin/coupons

---

# Server Actions

Use Server Actions wherever appropriate.

Examples

- Login
- Register
- Add to cart
- Wishlist
- Checkout
- Reviews
- Product CRUD
- Category CRUD
- Coupon CRUD

Avoid unnecessary API routes.

---

# Data Fetching

Use

- Server Components by default
- Client Components only when necessary
- Suspense
- Loading UI
- Error UI

---

# Caching

Use

- revalidatePath
- revalidateTag
- cacheTag

Invalidate cache after mutations.

---

# Performance

Implement

- Image optimization
- Dynamic imports
- Lazy loading
- Route-level loading.tsx
- Skeleton components
- Pagination
- Optimized database queries

---

# Accessibility

Follow WCAG basics.

Include

- Semantic HTML
- Keyboard navigation
- Proper labels
- Focus management
- ARIA attributes where necessary

---

# Responsive Design

Support

- Mobile
- Tablet
- Desktop

Use responsive layouts throughout.

---

# Error Handling

Implement

- not-found.tsx
- error.tsx
- Global error boundary
- Empty states
- Loading states

---

# UI Components

Create reusable components.

Examples

Buttons

Cards

Product Card

Rating

Avatar

Breadcrumb

Pagination

Modal

Drawer

Navbar

Sidebar

Dropdown

Search

Price Badge

Discount Badge

Empty State

Loading Skeleton

Toast

Alert

Confirmation Dialog

Table

Data Table

Forms

---

# SEO

Implement

- Metadata API
- Canonical URLs
- Open Graph
- Sitemap
- robots.txt
- JSON-LD Product Schema

---

# Nice Portfolio Features

Include features that demonstrate engineering quality.

- Optimistic UI for wishlist/cart updates
- Skeleton loading throughout
- URL-based filtering
- Recently viewed products
- Featured products
- Product recommendations
- Search suggestions
- Image gallery with thumbnails
- Sticky add-to-cart section
- Mobile bottom navigation
- Dark/light mode
- Beautiful empty states
- Elegant animations using CSS transitions (avoid excessive animation)
- Fully responsive design
- Consistent design system using DaisyUI themes

---

# Development Phases

## Phase 1

- Initialize project
- Configure Tailwind v4
- Configure DaisyUI
- Configure Drizzle
- Configure Neon
- Configure Auth
- Create folder structure

---

## Phase 2

- Design database schema
- Run migrations
- Seed sample data

---

## Phase 3

Build reusable UI components.

---

## Phase 4

Build public pages.

---

## Phase 5

Authentication.

---

## Phase 6

Cart and wishlist.

---

## Phase 7

Checkout flow.

---

## Phase 8

Customer dashboard.

---

## Phase 9

Admin dashboard.

---

## Phase 10

SEO, caching, optimization, accessibility, testing, and final polish.

---

# Coding Standards

- Prefer Server Components by default.
- Use Client Components only for interactive UI.
- Keep business logic out of UI components.
- Use TypeScript strict mode.
- Validate all inputs with Zod.
- Never duplicate logic.
- Create reusable hooks where appropriate.
- Keep components small and composable.
- Prefer composition over inheritance.
- Use meaningful naming conventions.
- Write clean, self-documenting code.
- Follow Next.js 16 best practices.
- Ensure all pages handle loading, error, and empty states gracefully.
- Keep the codebase organized and scalable as if it were intended for long-term production maintenance.
