"use client";

import type { Order } from "@/lib/types";
import Text from "@/shared/heading/Text";
import OrderCard from "./OrderCard";
import type { BoardColumnId } from "@/app/posConsole/utils/orderBoard";
import clsx from "clsx";
import type { IconType } from "react-icons";

type OrderColumnProps = {
  columnId: BoardColumnId;
  label: string;
  icon: IconType;
  orders: Order[];
  isActive: boolean;
  onActivate: (id: BoardColumnId) => void;
  onAccept?: (orderId: string) => void;
  onReject?: (orderId: string) => void;
  onMarkReady?: (orderId: string) => void;
  onMarkDelivered?: (orderId: string) => void;
  isActionPending?: boolean;
};

export default function OrderColumn({
  columnId,
  label,
  icon: Icon,
  orders,
  isActive,
  onActivate,
  onAccept,
  onReject,
  onMarkReady,
  onMarkDelivered,
  isActionPending,
}: OrderColumnProps) {
  return (
    <section className="flex min-h-0 w-[260px] shrink-0 flex-col">
      <button
        type="button"
        onClick={() => onActivate(columnId)}
        className="group relative mb-3 flex items-center justify-between gap-2 px-1 pb-3 text-left"
      >
        <div className="flex items-center gap-2">
          <Text as="h2" size="lg" type="bold" className="text-gray-900">
            {label}
          </Text>
          <span
            className={clsx(
              "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
              isActive
                ? "bg-brand-950 text-white"
                : "bg-gray-200 text-gray-700",
            )}
          >
            {orders.length}
          </span>
        </div>
        <Icon
          className={clsx(
            "h-4 w-4",
            isActive ? "text-brand-950" : "text-gray-400",
          )}
        />
        <span
          className={clsx(
            "absolute inset-x-0 bottom-0 h-0.5 rounded-full",
            isActive ? "bg-brand-700" : "bg-transparent",
          )}
        />
      </button>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {orders.length === 0 ? (
          <Text size="xs" variant="tertiary" className="px-1 py-8 text-center">
            No orders
          </Text>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              column={columnId}
              onAccept={onAccept}
              onReject={onReject}
              onMarkReady={onMarkReady}
              onMarkDelivered={onMarkDelivered}
              isActionPending={isActionPending}
            />
          ))
        )}
      </div>
    </section>
  );
}
