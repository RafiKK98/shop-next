import type { CartItemWithProduct } from "@/lib/cart";

export function computeCartTotals(
  items: CartItemWithProduct[],
  discountAmount: number = 0,
) {
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.product.price);
    const discount = parseFloat(item.product.discount || "0");
    const unitPrice = discount > 0 ? price * (1 - discount / 100) : price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const shipping = discountedSubtotal >= 100 ? 0 : 9.99;
  const tax = discountedSubtotal * 0.08;
  const total = discountedSubtotal + shipping + tax;

  return { subtotal, discountAmount, discountedSubtotal, shipping, tax, total };
}
