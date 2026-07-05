export const SITE = {
  name: "ShopNext",
  description: "Modern e-commerce platform built with Next.js 16",
  url: "https://shopnext.example.com",
  locale: "en-US",
} as const;

export const ROUTES = {
  home: "/",
  products: "/products",
  productDetail: (slug: string) => `/products/${slug}` as const,
  categories: "/categories",
  categoryDetail: (slug: string) => `/categories/${slug}` as const,
  search: "/search",
  cart: "/cart",
  checkout: "/checkout",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  dashboardOrders: "/dashboard/orders",
  dashboardProfile: "/dashboard/profile",
  dashboardWishlist: "/dashboard/wishlist",
  admin: "/admin",
  adminProducts: "/admin/products",
  adminCategories: "/admin/categories",
  adminOrders: "/admin/orders",
  adminUsers: "/admin/users",
  adminCoupons: "/admin/coupons",
} as const;

export const NAV_ITEMS = {
  main: [
    { label: "Home", href: ROUTES.home },
    { label: "Products", href: ROUTES.products },
    { label: "Categories", href: ROUTES.categories },
  ],
} as const;

export const PAGINATION = {
  defaultPageSize: 12,
  maxVisiblePages: 5,
  pageSizeOptions: [12, 24, 48] as const,
} as const;

export const IMAGES = {
  placeholder: "/images/placeholder.svg",
  productPlaceholder: "/images/product-placeholder.svg",
  avatarPlaceholder: "/images/avatar-placeholder.svg",
  blurDataUrl:
    "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEADmDO7A",
} as const;

export const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Best Selling", value: "best-selling" },
  { label: "Highest Rated", value: "rating" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" },
] as const;

export const DEFAULT_SORT = "featured";

export const RATING_OPTIONS = [4, 3, 2, 1] as const;

export const STOCK_FILTER_OPTIONS = [
  { label: "In Stock", value: "in-stock" },
  { label: "Out of Stock", value: "out-of-stock" },
] as const;
