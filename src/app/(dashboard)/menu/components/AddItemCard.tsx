"use client";

import Text from "@/shared/heading/Text";
import { FiPlus } from "react-icons/fi";

type AddItemCardProps = {
  onClick?: () => void;
};

export default function AddItemCard({ onClick }: AddItemCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group min-h-[300px] flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-white/60 px-6 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/60"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors group-hover:bg-brand-100 group-hover:text-brand-700">
        <FiPlus className="h-5 w-5" />
      </span>
      <Text as="p" size="base" type="semibold" className="text-gray-700">
        Add New Item
      </Text>
      <Text
        as="p"
        size="xs"
        variant="secondary"
        className="max-w-56 leading-relaxed"
      >
        Quickly expand your menu with new offerings
      </Text>
    </button>
  );
}
