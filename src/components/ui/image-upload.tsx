"use client";

import { uploadImageAction } from "@/actions/upload";
import { notify } from "@/lib/notifications";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_IMAGE_TYPES_SET,
  MAX_FILE_SIZE,
  UPLOAD_FOLDERS,
  type UploadFolder,
} from "@/lib/upload";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useRef,
  useState,
} from "react";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  folder?: UploadFolder;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  maxFiles = 10,
  folder = UPLOAD_FOLDERS.products,
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const remaining = maxFiles - value.length;

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const batch = Array.from(files).slice(0, remaining);
      if (batch.length === 0) return;

      setUploading(true);

      for (const file of batch) {
        if (!ACCEPTED_IMAGE_TYPES_SET.has(file.type)) {
          notify.error(`"${file.name}" has an unsupported file type.`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          const mb = (file.size / 1024 / 1024).toFixed(1);
          notify.error(
            `"${file.name}" is too large (${mb}MB). Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
          );
          continue;
        }

        const fd = new FormData();
        fd.set("file", file);
        fd.set("folder", folder);

        const result = await uploadImageAction(fd);
        if ("error" in result) notify.error(result.error);
        else onChange([...value, result.url]);
      }

      setUploading(false);
    },
    [value, onChange, remaining, folder],
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled || uploading) return;
      uploadFiles(e.dataTransfer.files);
    },
    [uploadFiles, disabled, uploading],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return;
      uploadFiles(e.target.files);
      e.target.value = "";
    },
    [uploadFiles],
  );

  const removeImage = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange],
  );

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {remaining > 0 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload images"
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-base-300 hover:border-base-content/30"
          } ${disabled || uploading ? "pointer-events-none opacity-50" : ""}`}
        >
          {uploading ? (
            <>
              <Loader2 className="mb-2 size-8 animate-spin text-base-content/40" />
              <p className="text-sm text-base-content/60">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="mb-2 size-8 text-base-content/40" />
              <p className="text-sm font-medium text-base-content/70">
                Drop images here or click to browse
              </p>
              <p className="mt-1 text-xs text-base-content/40">
                JPEG, PNG, WebP, GIF, or AVIF &bull; Max{" "}
                {MAX_FILE_SIZE / 1024 / 1024}MB each
              </p>
              {maxFiles < Infinity && (
                <p className="text-xs text-base-content/40">
                  {remaining} of {maxFiles} slot{maxFiles !== 1 ? "s" : ""}{" "}
                  remaining
                </p>
              )}
            </>
          )}
        </div>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {value.map((url, index) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-xl border border-base-200 bg-base-100"
            >
              <Image
                src={url}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="btn btn-square btn-xs absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
