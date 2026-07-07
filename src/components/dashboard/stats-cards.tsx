import { ShoppingBag, Clock, Heart, ShoppingCart } from "lucide-react";

interface StatsCardsProps {
  totalOrders: number;
  pendingOrders: number;
  wishlistCount: number;
  cartCount: number;
}

const cards = [
  {
    label: "Total Orders",
    icon: ShoppingBag,
    color: "text-primary bg-primary/10",
    getValue: (p: StatsCardsProps) => p.totalOrders,
  },
  {
    label: "Pending Orders",
    icon: Clock,
    color: "text-warning bg-warning/10",
    getValue: (p: StatsCardsProps) => p.pendingOrders,
  },
  {
    label: "Wishlist Items",
    icon: Heart,
    color: "text-error bg-error/10",
    getValue: (p: StatsCardsProps) => p.wishlistCount,
  },
  {
    label: "Cart Items",
    icon: ShoppingCart,
    color: "text-info bg-info/10",
    getValue: (p: StatsCardsProps) => p.cartCount,
  },
];

export function StatsCards(props: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-base-200 bg-base-100 p-4"
        >
          <div className="flex items-center justify-between">
            <span className={`flex size-10 items-center justify-center rounded-lg ${card.color}`}>
              <card.icon className="size-5" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold">{card.getValue(props)}</p>
          <p className="text-xs text-base-content/50">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
