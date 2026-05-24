"use client";

import Text from "@/shared/heading/Text";
import type { MenuItem } from "@/lib/types";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import MenuItemImage from "./MenuItemImage";
import Button from "@/shared/buttons/Button";
import { formatINR } from "@/utils/functions";

type MenuItemCardProps = {
  item: MenuItem;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (item: MenuItem) => void;
};

export default function MenuItemCard({
  item,
  onEdit,
  onDelete,
}: MenuItemCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_1px_2px_rgba(15,35,80,0.04)]">
      <MenuItemImage
        imageUrl={item.imageUrl}
        category={item.category}
        name={item.name}
        status={item.status}
      />

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Text
            as="h3"
            size="sm"
            type="bold"
            className="leading-snug text-gray-900"
          >
            {item.name}
          </Text>
          <span className="shrink-0 rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">
            #{item.sku}
          </span>
        </div>

        <Text
          as="p"
          size="xs"
          variant="secondary"
          className="line-clamp-2 leading-relaxed"
        >
          {item.description}
        </Text>

        <div className="mt-2 flex items-center justify-between gap-2">
          <Text as="span" size="lg" type="bold" className="text-gray-900">
            {formatINR(item.price)}
          </Text>
          <div className="flex items-center">
            <Button
              variant="tertiary"
              className="!h-8 !w-8 !p-0"
              icon={<FiEdit2 className="h-4 w-4" />}
              onClick={() => onEdit?.(item)}
            />
            <Button
              variant="tertiary"
              className="!h-8 !w-8 !p-0 text-red-500 hover:bg-red-50"
              icon={<FiTrash2 className="h-4 w-4" />}
              onClick={() => onDelete?.(item)}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
