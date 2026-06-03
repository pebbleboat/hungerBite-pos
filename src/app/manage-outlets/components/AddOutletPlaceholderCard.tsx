"use client";

import Text from "@/shared/heading/Text";
import { FiPlus, FiShoppingBag } from "react-icons/fi";

type AddOutletPlaceholderCardProps = {
  onClick: () => void;
};

const AddOutletPlaceholderCard = ({ onClick }: AddOutletPlaceholderCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/60 px-6 py-10 text-center transition hover:border-brand-300 hover:bg-brand-50/30"
    >
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <FiShoppingBag className="h-6 w-6" />
        <FiPlus className="-ml-2 h-4 w-4" />
      </span>
      <Text as="span" size="base" type="bold" className="text-brand-950">
        Add New Outlet
      </Text>
      <Text size="sm" variant="secondary" className="mt-2 max-w-[220px]">
        Register a new physical or cloud location
      </Text>
    </button>
  );
};

export default AddOutletPlaceholderCard;
