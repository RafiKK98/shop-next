"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button, Modal, ModalBody, ModalActions } from "@/components/ui";
import { deleteCategory } from "@/actions/admin/categories";
import { notify, crud, errors } from "@/lib/notifications";

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
}

export function DeleteCategoryButton({
  categoryId,
  categoryName,
}: DeleteCategoryButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    setOpen(false);

    const promise = deleteCategory(categoryId).then((result) => {
      if ("error" in result) throw new Error(result.error);
      router.refresh();
      return result;
    });

    notify.promise(promise, {
      loading: "Deleting category...",
      success: crud.deleted("Category"),
      error: (err) => (err as Error).message || errors.unexpected,
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-ghost btn-square btn-sm text-error"
        aria-label="Delete category"
      >
        <Trash2 className="size-4" />
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="text-lg font-bold">Delete Category</h3>
        <ModalBody>
          <p>
            Are you sure you want to delete{" "}
            <strong>{categoryName}</strong>?
          </p>
          <p className="mt-2 text-sm text-base-content/50">
            Categories with products cannot be deleted. You must reassign or
            delete associated products first.
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
