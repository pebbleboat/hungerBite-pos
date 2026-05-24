"use client";

import type { CatalogOutlet } from "@/lib/types";
import Text from "@/shared/heading/Text";
import clsx from "clsx";
import { FiArrowRight } from "react-icons/fi";

type OutletSelectCardProps = {
  outlet: CatalogOutlet;
  onSelect: (outlet: CatalogOutlet) => void;
  isSelecting?: boolean;
  disabled?: boolean;
};

function outletMetaLine(outlet: CatalogOutlet): string {
  const parts = [outlet.city, outlet.address].filter(Boolean);
  return parts.join(" · ");
}

const OutletSelectCard = ({
  outlet,
  onSelect,
  isSelecting = false,
  disabled = false,
}: OutletSelectCardProps) => {
  const meta = outletMetaLine(outlet);
  const shiftOpen = outlet.status === "open";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(outlet)}
      className={clsx(
        "flex w-full items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-4 text-left transition",
        "hover:border-brand-300 hover:bg-brand-50/40",
        "disabled:cursor-not-allowed disabled:opacity-60",
        isSelecting && "border-brand-400 bg-brand-50/60",
      )}
    >
      <div className="min-w-0 flex-1">
        <Text as="span" size="base" type="semibold" className="text-brand-950">
          {outlet.name}
        </Text>
        {meta ? (
          <Text as="p" size="xs" variant="secondary" className="mt-0.5 truncate">
            {meta}
          </Text>
        ) : null}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span
            className={clsx(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              shiftOpen
                ? "bg-emerald-50 text-emerald-700"
                : "bg-gray-100 text-gray-600",
            )}
          >
            {shiftOpen ? "Open" : "Closed"}
          </span>
          {outlet.isAcceptingOrders != null ? (
            <span
              className={clsx(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                outlet.isAcceptingOrders
                  ? "bg-brand-50 text-brand-800"
                  : "bg-amber-50 text-amber-800",
              )}
            >
              {outlet.isAcceptingOrders ? "Taking orders" : "Paused"}
            </span>
          ) : null}
        </div>
      </div>
      <span className="flex shrink-0 items-center gap-1 text-brand-700">
        <Text as="span" size="sm" type="semibold">
          {isSelecting ? "Signing in…" : "Select"}
        </Text>
        {!isSelecting ? <FiArrowRight className="h-4 w-4" /> : null}
      </span>
    </button>
  );
};

export default OutletSelectCard;
