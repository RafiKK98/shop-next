"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { SearchModal } from "./search-modal";

interface SearchTriggerProps {
  userRole: string | null;
}

export function SearchTrigger({ userRole }: SearchTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn btn-ghost btn-square"
        onClick={() => setOpen(true)}
        aria-label="Search pages"
      >
        <Search size={18} />
      </button>
      <SearchModal
        open={open}
        onClose={() => setOpen(false)}
        userRole={userRole}
      />
    </>
  );
}
