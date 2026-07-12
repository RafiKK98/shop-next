import { getCartItems } from "@/lib/cart";

export interface CartValidation {
  valid: boolean;
  errors: string[];
  items: Awaited<ReturnType<typeof getCartItems>>;
}

export async function validateCart(userId: string): Promise<CartValidation> {
  const errors: string[] = [];
  const items = await getCartItems(userId);

  if (items.length === 0) {
    return { valid: false, errors: ["Your cart is empty"], items };
  }

  for (const item of items) {
    const stock = item.product.stock ?? 0;
    if (stock < 1) {
      errors.push(`"${item.product.title}" is no longer available`);
    } else if (item.quantity > stock) {
      errors.push(
        `Only ${stock} of "${item.product.title}" are available (you requested ${item.quantity})`,
      );
    }
  }

  return { valid: errors.length === 0, errors, items };
}

export function computeCartTotals(
  items: Awaited<ReturnType<typeof getCartItems>>,
) {
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
