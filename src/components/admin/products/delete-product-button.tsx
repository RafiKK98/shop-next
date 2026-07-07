"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button, Modal, ModalBody, ModalActions } from "@/components/ui";
import { deleteProduct } from "@/actions/admin/products";

interface DeleteProductButtonProps {
  productId: string;
  productTitle: string;
}

export function DeleteProductButton({ productId, productTitle }: DeleteProductButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteProduct(productId);
      if ("error" in result) {
        setError(result.error);
      } else {
        setOpen(false);
        router.refresh();
      }
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
          {error && (
            <div className="mt-3 rounded-lg border border-error/30 bg-error/5 px-3 py-2 text-sm text-error" role="alert">
              {error}
            </div>
          )}
        </ModalBody>
        <ModalActions>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDelete}
            loading={isPending}
            className="btn-error"
          >
            Delete
          </Button>
        </ModalActions>
      </Modal>
    </>
  );
}
