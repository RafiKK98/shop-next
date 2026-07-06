import type { CartItemWithProduct } from "@/lib/cart";

export function computeCartTotals(items: CartItemWithProduct[]) {
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.product.price);
    const discount = parseFloat(item.product.discount || "0");
    const unitPrice = discount > 0 ? price * (1 - discount / 100) : price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}
