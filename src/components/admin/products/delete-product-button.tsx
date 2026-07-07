"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button, Modal, ModalBody, ModalActions } from "@/components/ui";
import { deleteProduct } from "@/actions/admin/products";
import { notify, crud, errors } from "@/lib/notifications";

interface DeleteProductButtonProps {
  productId: string;
  productTitle: string;
}

export function DeleteProductButton({ productId, productTitle }: DeleteProductButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    setOpen(false);

    const promise = deleteProduct(productId).then((result) => {
      if ("error" in result) throw new Error(result.error);
      router.refresh();
      return result;
    });

    notify.promise(promise, {
      loading: "Deleting product...",
      success: crud.deleted("Product"),
      error: (err) => (err as Error).message || errors.unexpected,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-ghost btn-square btn-sm text-error"
        aria-label="Delete product"
      >
        <Trash2 className="size-4" />
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="text-lg font-bold">Delete Product</h3>
        <ModalBody>
          <p>
            Are you sure you want to delete <strong>{productTitle}</strong>?
          </p>
          <p className="mt-2 text-sm text-base-content/50">
            This action cannot be undone. Products referenced by orders cannot be deleted.
          </p>
        </ModalBody>
        <ModalActions>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDelete}
            className="btn-error"
          >
            Delete
          </Button>
        </ModalActions>
      </Modal>
    </>
  );
}
