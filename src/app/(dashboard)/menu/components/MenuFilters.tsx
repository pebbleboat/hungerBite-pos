"use client";

import InputField from "@/shared/input/InputField";
import {
  MENU_CATEGORY_OPTIONS,
  MENU_STATUS_OPTIONS,
} from "@/app/(dashboard)/menu/utils/menuConstants";
import { FiChevronDown, FiSearch, FiSliders } from "react-icons/fi";

type MenuFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
};

function FilterSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  ariaLabel: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-9 text-sm font-medium text-gray-700 outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

export default function MenuFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
}: MenuFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-[0_1px_2px_rgba(15,35,80,0.04)] md:flex-row md:items-center">
      <div className="flex-1">
        <InputField
          name="menu-search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search items by name, SKU, or category…"
          icon={<FiSearch className="h-[18px] w-[18px] text-gray-400" />}
          className="border-gray-200! bg-white! pl-10! text-gray-900! placeholder:text-gray-400"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          ariaLabel="Filter by category"
          value={category}
          onChange={onCategoryChange}
          options={MENU_CATEGORY_OPTIONS}
        />
        <FilterSelect
          ariaLabel="Filter by status"
          value={status}
          onChange={onStatusChange}
          options={MENU_STATUS_OPTIONS}
        />
        <button
          type="button"
          aria-label="More filters"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        >
          <FiSliders className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
