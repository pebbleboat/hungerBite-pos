"use client";

import {
  CATEGORY_EMOJI,
  CATEGORY_GRADIENTS,
} from "@/app/(dashboard)/menu/utils/menuConstants";
import Text from "@/shared/heading/Text";
import type { MenuItemStatus } from "@/lib/types";
import clsx from "clsx";
import { FiCheckCircle } from "react-icons/fi";

type MenuItemImageProps = {
  imageUrl?: string;
  category: string;
  name: string;
  status: MenuItemStatus;
};

const STATUS_STYLES: Record<
  MenuItemStatus,
  { label: string; className: string }
> = {
  available: {
    label: "Available",
    className: "bg-white/90 text-emerald-700 ring-1 ring-emerald-200",
  },
  unavailable: {
    label: "Unavailable",
    className: "bg-white/90 text-gray-600 ring-1 ring-gray-200",
  },
  out_of_stock: {
    label: "Out of stock",
    className: "bg-white/90 text-red-600 ring-1 ring-red-200",
  },
};

export default function MenuItemImage({
  imageUrl,
  category,
  name,
  status,
}: MenuItemImageProps) {
  const gradient =
    CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS.default;
  const emoji = CATEGORY_EMOJI[category] ?? CATEGORY_EMOJI.default;
  const statusStyle = STATUS_STYLES[status];

  return (
    <div
      className={clsx(
        "relative h-44 w-full overflow-hidden rounded-t-xl bg-linear-to-br",
        gradient,
      )}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-6xl">
          <span aria-hidden>{emoji}</span>
        </div>
      )}

      <span
        className={clsx(
          "absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 backdrop-blur",
          statusStyle.className,
        )}
      >
        <FiCheckCircle className="h-3 w-3" />
        <Text as="span" size="xxs" type="semibold">
          {statusStyle.label}
        </Text>
      </span>
    </div>
  );
}
