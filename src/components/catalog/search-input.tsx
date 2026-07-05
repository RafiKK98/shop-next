"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const DEBOUNCE_MS = 300;

export function SearchInput({ value, onChange, placeholder = "Search products..." }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const initialSyncDone = useRef(false);

  useEffect(() => {
    if (!initialSyncDone.current) {
      initialSyncDone.current = true;
      return;
    }
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (localValue === value) return;
    const timer = setTimeout(() => {
      onChange(localValue);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [localValue, value, onChange]);

  const handleClear = useCallback(() => {
    setLocalValue("");
    onChange("");
  }, [onChange]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-base-content/40" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="input input-bordered w-full pl-9 pr-9"
        aria-label="Search products"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-base-content"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
