"use client";
import clsx from "clsx";
import { useRef, useState, useCallback, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  wrapperClass?: string;
  errorMessage?: string;
}

const MultiSelect = ({
  label,
  options,
  value = [],
  onChange,
  placeholder = "Search...",
  required = false,
  className,
  wrapperClass,
  errorMessage,
}: MultiSelectProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter((opt) => value.includes(opt.value));
  const filteredOptions = options.filter(
    (opt) =>
      !value.includes(opt.value) &&
      opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = useCallback(
    (opt: MultiSelectOption) => {
      onChange?.([...value, opt.value]);
      setSearch("");
    },
    [value, onChange],
  );

  const handleRemove = useCallback(
    (val: string) => {
      onChange?.(value.filter((v) => v !== val));
    },
    [value, onChange],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={clsx("relative flex flex-col gap-y-1", wrapperClass)}
      ref={containerRef}
    >
      {label && (
        <label className="text-sm">
          {label}
          {required && <span className="text-red-500">&nbsp;*</span>}
        </label>
      )}
      <div
        className={clsx(
          "min-h-11 rounded-lg border px-3 py-2 text-sm outline-none flex flex-wrap items-center gap-2",
          errorMessage ? "border-red-500" : "border-gray-100",
          className,
        )}
        onClick={() => setIsOpen(true)}
      >
        <FiSearch className="w-4 h-4 text-gray-400 shrink-0" />
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          {selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 text-xs font-medium"
            >
              {opt.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(opt.value);
                }}
                className="hover:bg-brand-100 rounded p-0.5"
                aria-label={`Remove ${opt.label}`}
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={selectedOptions.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[80px] outline-none bg-transparent text-sm"
          />
        </div>
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg py-1">
          {filteredOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
      {errorMessage && (
        <div className="text-xs text-red-600">{errorMessage}</div>
      )}
    </div>
  );
};

export default MultiSelect;
