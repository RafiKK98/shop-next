import { ROUTES } from "./index";

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: NavLink[];
}

export const NAVIGATION = {
  main: [
    { label: "Home", href: ROUTES.home },
    { label: "Products", href: ROUTES.products },
    { label: "Categories", href: ROUTES.categories },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavLink[],

  footer: {
    company: {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Contact Us", href: "/contact" },
        { label: "Press", href: "#" },
        { label: "Blog", href: "#" },
      ],
    } satisfies FooterSection,

    shop: {
      title: "Shop",
      links: [
        { label: "All Products", href: ROUTES.products },
        { label: "Categories", href: ROUTES.categories },
        { label: "Best Sellers", href: ROUTES.products + "?sort=best-selling" },
        { label: "New Arrivals", href: ROUTES.products + "?sort=newest" },
      ],
    } satisfies FooterSection,

    customerService: {
      title: "Customer Service",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "FAQs", href: "/faq" },
        { label: "Shipping Info", href: "#" },
        { label: "Returns & Exchanges", href: "#" },
      ],
    } satisfies FooterSection,

    resources: {
      title: "Resources",
      links: [
        { label: "Size Guide", href: "#" },
        { label: "Gift Cards", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
      ],
    } satisfies FooterSection,
  },

  social: [
    { label: "Facebook", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
  ] satisfies NavLink[],

  account: [
    { label: "My Account", href: ROUTES.dashboard },
    { label: "Orders", href: ROUTES.dashboardOrders },
    { label: "Wishlist", href: ROUTES.wishlist },
    { label: "Sign Out", href: "#" },
  ] satisfies NavLink[],
} as const;
