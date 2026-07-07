import { toast } from "sonner";

// ── Core notification methods ───────────────────────────────────────────

export const notify = {
  success(message: string, description?: string) {
    return toast.success(message, { description });
  },

  error(message: string, description?: string) {
    return toast.error(message, { description });
  },

  warning(message: string, description?: string) {
    return toast.warning(message, { description });
  },

  info(message: string, description?: string) {
    return toast.info(message, { description });
  },

  loading(message: string) {
    return toast.loading(message);
  },

  dismiss(toastId?: string) {
    toast.dismiss(toastId);
  },

  promise<T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string | ((err: unknown) => string) },
  ) {
    return toast.promise(promise, messages);
  },
};

// ── Standardized message helpers ────────────────────────────────────────

export const crud = {
  created: (entity: string) => `${entity} created successfully`,
  updated: (entity: string) => `${entity} updated successfully`,
  deleted: (entity: string) => `${entity} deleted successfully`,
};

export const auth = {
  login: "Logged in successfully",
  register: "Account created successfully",
  logout: "Logged out successfully",
  invalidCredentials: "Invalid email or password",
};

export const commerce = {
  addedToCart: "Added to cart",
  removedFromCart: "Removed from cart",
  wishlistUpdated: "Wishlist updated",
  orderPlaced: "Order placed successfully",
};

export const errors = {
  network: "A network error occurred. Please check your connection.",
  unexpected: "Something went wrong. Please try again.",
  permissionDenied: "You don't have permission to perform this action.",
};
