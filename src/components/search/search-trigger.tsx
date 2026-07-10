"use client";

import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { SearchModal } from "./search-modal";

interface SearchTriggerProps {
  userRole: string | null;
}

export function SearchTrigger({ userRole }: SearchTriggerProps) {
  const [open, setOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setModalKey((k) => k + 1);
  }, []);

  return (
    <>
      <button
        type="button"
        className="btn btn-ghost btn-square"
        onClick={handleOpen}
        aria-label="Search pages"
      >
        <Search size={18} />
      </button>
      {open && (
        <SearchModal
          key={modalKey}
          onClose={() => setOpen(false)}
          userRole={userRole}
        />
      )}
    </>
  );
}
