# Performance & Caching Strategy

## Rendering Strategy

### Static Rendering (SSG)
Pages with static/mock data that never change:
- `/` (Home)
- `/about`
- `/faq`
- `/login`
- `/register`

These are automatically fully static via PPR — no dynamic data access.

### Incremental Static Regeneration (ISR)
Pages backed by cached data fetching:
- `/products/[slug]` — product detail with cached reviews and product query
- `/products` — catalog with cached data

ISR is implemented via `use cache` directive in service functions rather than `export const revalidate`.

### Dynamic Rendering
User-specific pages that always need fresh data:
- `/cart` — user's cart items
- `/checkout` — checkout flow with stock validation
- `/checkout/success` — order confirmation
- `/search` — search results
- `/wishlist` — user's wishlist
- `/account/*` — all dashboard pages
- `/admin/*` — all admin pages

These call `auth()` which reads cookies, making them dynamic.

---

## Caching Strategy

### Cache Components (`next.config.ts`)
- `cacheComponents: true` enables PPR with `use cache` support
- Custom `cacheLife` profiles: `seconds`, `minutes`, `hours`

### Data Caching (cross-request, shared)
Stable, non-user-specific data is cached with the `use cache` directive:

| Service | Cache Profile | Tags | Rationale |
|---|---|---|---|
| `getStoreSettings()` | `hours` (revalidate 1h, stale 5min) | `store-settings` | Rarely changes, used everywhere |
| `getDashboardAnalytics()` | `minutes` (revalidate 1min, stale 5min) | `admin-analytics` | Expensive — 15 parallel queries |
| `getAdminCategories()` (dropdown) | `hours` (revalidate 1h) | `categories` | Stable dropdown data |
| `getOrderStats()` | `minutes` (revalidate 1min) | `orders` | Admin dashboard metrics |

### Per-Request Deduplication (`React.cache()`)
Parameterized queries that benefit from dedup within a single render:

| Service | Rationale |
|---|---|
| `getAdminProductById(id)` | Called from multiple admin panels |
| `getAdminCategoryById(id)` | Called from edit page + layout |
| `getAdminOrderById(id)` | Called from order detail page |
| `getAdminCouponById(id)` | Called from coupon edit page |
| `getAdminUserById(id)` | Called from user detail page |

### Skip Caching
- User-specific data (cart, wishlist, orders by user)
- Search/filter-based queries (too many unique cache keys)
- Mutations and ownership checks (naturally dynamic)

---

## Revalidation Strategy

### Path-Based (`revalidatePath`)
Used for page-level invalidation after mutations. Keeps the current request's page fresh.

### Tag-Based (`updateTag`)
Used alongside `revalidatePath` for cross-request cache invalidation:

| Mutation | Tags Invalidated |
|---|---|
| Product CRUD | `products` |
| Category CRUD | `categories` |
| Coupon CRUD | `coupons` |
| Order status/payment update | `orders` |
| Review create/update/moderate | `reviews` |
| User update | `users` |
| Settings save | `store-settings` |
| Checkout (place order) | `orders`, `products` |
| Order cancellation | `orders`, `products` |

`updateTag()` is preferred over `revalidateTag()` in Server Actions because it immediately expires the cache (read-your-own-writes), while `revalidateTag()` uses stale-while-revalidate.

---

## Query Optimizations

- **Aggregate calculations** — `getProductReviews` computes total, average, and rating breakdown in a single query using PostgreSQL `filter` clauses instead of separate queries
- **Count + data in parallel** — All paginated admin lists run `count()` and data queries concurrently via `Promise.all`
- **Admin analytics** — 15 queries run in parallel with zero sequential dependency (all counts, revenue, charts, and lists are independent)
- **Stock validation in transaction** — `createOrder` uses `sql\`${products.stock} >= ${vi.quantity}\`` in the WHERE clause for atomic decrement with over-sell protection
- **Subqueries for calculated fields** — Product count, order count, and thumbnail use correlated subqueries rather than application-level joins

### Identified N+1
- `createOrder` in `checkout.ts` iterates cart items and calls `fetchProduct()` and `getFirstProductImage()` per item. These are sequential and could be batched. Currently mitigated by the transactional guarantees.

---

## Bundle Optimizations

- **Server Components by default** — Only 68 files use `"use client"`, all legitimate (hooks, state, events)
- **`status-timeline.tsx`** — Converted from client to server component (purely presentational)
- **Chart components** — `recharts` is only loaded on admin page (dynamic import via `next/dynamic` would add overhead for a single admin dashboard)
- **No component-level dynamic imports** currently used; admin charts load eagerly (acceptable for admin-only routes)

---

## Image Optimization

- All product images use `next/image` with `picsum.photos` and `res.cloudinary.com` configured in `remotePatterns`
- `<img>` tag in `welcome-section.tsx` replaced with `next/image`
- Images use `fill` + `object-cover` for consistent aspect ratios
- Lazy loading is default for `next/image`

---

## Loading Performance

### loading.tsx Files

| Route | Loading UI |
|---|---|
| `/(public)` | Product card grid skeleton |
| `/products/[slug]` | Product detail skeleton |
| `/cart` | Cart items skeleton |
| `/checkout` | Multi-step checkout skeleton |
| `/wishlist` | Product grid skeleton |
| `/account` | Sidebar + content skeleton |
| `/account/orders` | Order list skeleton |
| `/account/orders/[orderId]` | Order detail skeleton |
| `/admin` | Admin dashboard skeleton |

All loading states use `role="status"` for screen reader announcements.

### Error Boundaries

| Route | Error File |
|---|---|
| Root | `error.tsx`, `global-error.tsx` |
| Public route group | `error.tsx` |
| Products route group | `error.tsx` |
| Admin route group | `error.tsx` |

### Not Found Pages

| Route | Not Found |
|---|---|
| Root | `not-found.tsx` |
| `/products/[slug]` | `not-found.tsx` |
| `/account/orders/[orderId]` | `not-found.tsx` |

---

## Cache Tag Constants

All cache tag strings are centralized in `src/lib/cache.ts`:

```ts
export const CACHE_TAGS = {
  STORE_SETTINGS: "store-settings",
  PRODUCTS: "products",
  CATEGORIES: "categories",
  ORDERS: "orders",
  COUPONS: "coupons",
  REVIEWS: "reviews",
  USERS: "users",
  ADMIN_ANALYTICS: "admin-analytics",
} as const;
```

This prevents tag name typos and makes it easy to audit all cache interactions.
