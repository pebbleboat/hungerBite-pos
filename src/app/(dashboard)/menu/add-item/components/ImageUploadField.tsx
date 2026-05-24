"use client";

import Text from "@/shared/heading/Text";
import clsx from "clsx";
import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";

type ImageUploadFieldProps = {
  value: File | null;
  existingImageUrl?: string;
  onChange: (file: File | null) => void;
  onBlur?: () => void;
  errorMessage?: string;
};

export default function ImageUploadField({
  value,
  existingImageUrl = "",
  onChange,
  onBlur,
  errorMessage,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(existingImageUrl);
  }, [value, existingImageUrl]);

  const openPicker = () => inputRef.current?.click();

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0] ?? null;
    onChange(file);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onChange(null);
  };

  return (
    <div className="space-y-1.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        className="hidden"
        onChange={handleChange}
        onBlur={onBlur}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isDragging) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={clsx(
          "relative flex h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-gray-50/60 px-4 text-center transition-colors",
          errorMessage
            ? "border-red-300 bg-red-50/40"
            : isDragging
              ? "border-brand-400 bg-brand-50/60"
              : "border-gray-200 hover:border-brand-300 hover:bg-brand-50/40",
        )}
      >
        {previewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Selected"
              className="h-full w-full rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow hover:bg-white"
              aria-label="Remove image"
            >
              <FiX className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <FiUploadCloud className="h-5 w-5" />
            </span>
            <Text
              as="p"
              size="sm"
              type="semibold"
              className="mt-3 text-gray-900"
            >
              Click or drag to upload photo
            </Text>
            <Text size="xs" variant="secondary" className="mt-1">
              Supports JPG, PNG (Max 5MB)
            </Text>
            <Text size="xs" variant="tertiary" className="mt-0.5">
              Recommended: 800×600px
            </Text>
          </>
        )}
      </div>

      {errorMessage ? (
        <Text size="xs" className="text-red-600">
          {errorMessage}
        </Text>
      ) : null}
    </div>
  );
}
