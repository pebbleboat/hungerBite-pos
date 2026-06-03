"use client";

import type { CatalogOutlet } from "@/lib/types";
import Button from "@/shared/buttons/Button";
import Text from "@/shared/heading/Text";
import clsx from "clsx";
import { FiEdit2, FiGrid, FiMapPin, FiPhone, FiTrash2 } from "react-icons/fi";

type OutletManageCardProps = {
  outlet: CatalogOutlet;
  posLabel: string;
  onEdit: (outlet: CatalogOutlet) => void;
  onDelete: (outlet: CatalogOutlet) => void;
};

function formatAddress(outlet: CatalogOutlet): string {
  const parts = [outlet.address, outlet.city].filter(Boolean);
  return parts.join(", ") || "Address not set";
}

const OutletManageCard = ({
  outlet,
  posLabel,
  onEdit,
  onDelete,
}: OutletManageCardProps) => {
  const isOnline = outlet.status === "open";

  return (
    <article className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 p-5 pb-4">
        <Text as="span" size="xs" type="semibold" variant="secondary">
          {posLabel}
        </Text>
        <span
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
            isOnline
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-gray-500",
          )}
        >
          <span
            className={clsx(
              "h-1.5 w-1.5 rounded-full",
              isOnline ? "bg-emerald-500" : "bg-gray-400",
            )}
          />
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <Text as="h2" size="lg" type="bold" className="text-brand-950">
          {outlet.name}
        </Text>

        <ul className="mt-4 space-y-2.5">
          <li className="flex items-center gap-2.5 text-gray-600">
            <FiGrid className="h-4 w-4 shrink-0 text-gray-400" />
            <Text as="span" size="sm" variant="secondary">
              Dine-in &amp; Takeaway
            </Text>
          </li>
          <li className="flex items-start gap-2.5 text-gray-600">
            <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <Text as="span" size="sm" variant="secondary">
              {formatAddress(outlet)}
            </Text>
          </li>
          <li className="flex items-center gap-2.5 text-gray-600">
            <FiPhone className="h-4 w-4 shrink-0 text-gray-400" />
            <Text as="span" size="sm" variant="secondary">
              {outlet.phone?.trim() || "Phone not set"}
            </Text>
          </li>
        </ul>
      </div>
      <div className="flex justify-end border-t border-gray-100 px-2 py-3.5">
        <Button
          icon={<FiEdit2 className="h-4 w-4" />}
          variant="tertiary"
          className="!p-0 !h-9 !w-9"
          onClick={() => onEdit(outlet)}
        />
        <Button
          icon={<FiTrash2 className="h-4 w-4 text-red-500" />}
          variant="tertiary"
          className="!p-0 !h-9 !w-9 hover:!bg-red-50"
          onClick={() => onDelete(outlet)}
        />
      </div>
    </article>
  );
};

export default OutletManageCard;
