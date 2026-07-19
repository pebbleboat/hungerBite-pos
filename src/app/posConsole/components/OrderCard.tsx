"use client";

import type { Order } from "@/lib/types";
import Button from "@/shared/buttons/Button";
import Text from "@/shared/heading/Text";
import {
  formatCurrency,
  formatHistoryTime,
  formatOrderCode,
  getHistoryStatusDisplay,
  getOrderTotal,
  type BoardColumnId,
} from "@/app/posConsole/utils/orderBoard";
import {
  formatInStatus,
  formatMinAgo,
  formatWaiting,
  isPendingUrgent,
  isPreparingUrgent,
} from "@/app/posConsole/utils/timeHelpers";
import clsx from "clsx";
import { FiAlertCircle, FiCheck, FiClock, FiX } from "react-icons/fi";

type OrderCardProps = {
  order: Order;
  column: BoardColumnId;
  onAccept?: (orderId: string) => void;
  onReject?: (orderId: string) => void;
  onMarkReady?: (orderId: string) => void;
  onMarkDelivered?: (orderId: string) => void;
  isActionPending?: boolean;
};

function formatItemLines(order: Order): string {
  if (!order.items.length) return "—";
  return order.items.map((line) => `${line.quantity}x ${line.name}`).join(", ");
}

function customerOf(order: Order): string {
  return order.customerName?.trim() || "Guest";
}

function totalOf(order: Order): number {
  return getOrderTotal(order);
}

function HistoryCard({ order }: { order: Order }) {
  const statusDisplay = getHistoryStatusDisplay(order.status);
  const isRejected = order.status.toLowerCase() === "rejected";

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <Text
          as="span"
          size="xxs"
          type="semibold"
          variant="quaternary"
          className="tracking-wide"
        >
          {formatOrderCode(order.id)}
        </Text>
        <span
          className={clsx(
            "inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide",
            statusDisplay.toneClass,
          )}
        >
          {isRejected ? (
            <FiX className="h-3 w-3" strokeWidth={3} />
          ) : (
            <FiCheck className="h-3 w-3" strokeWidth={3} />
          )}
          {statusDisplay.label}
        </span>
      </div>
      <Text as="p" size="sm" type="semibold" className="mt-2 text-gray-900">
        {customerOf(order)}
      </Text>
      <div className="mt-1 flex items-center justify-between gap-2">
        <Text
          as="span"
          size="sm"
          type="semibold"
          className={statusDisplay.amountClass}
        >
          {formatCurrency(totalOf(order))}
        </Text>
        <Text as="span" size="xxs" variant="tertiary">
          {formatHistoryTime(order.updatedAt ?? order.createdAt) || "—"}
        </Text>
      </div>
    </div>
  );
}

export default function OrderCard({
  order,
  column,
  onAccept,
  onReject,
  onMarkReady,
  onMarkDelivered,
  isActionPending,
}: OrderCardProps) {
  if (column === "history") {
    return <HistoryCard order={order} />;
  }

  const pendingUrgent =
    column === "pending" && isPendingUrgent(order.createdAt);
  const preparingUrgent =
    column === "preparing" &&
    isPreparingUrgent(order.acceptedAt ?? order.updatedAt);

  return (
    <div
      className={clsx(
        "rounded-xl border bg-white p-4 shadow-[0_1px_2px_rgba(15,35,80,0.04)]",
        preparingUrgent ? "border-red-200" : "border-gray-100",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Text
          as="span"
          size="xs"
          type="semibold"
          className="tracking-wide text-gray-500"
        >
          {formatOrderCode(order.id)}
        </Text>

        {column === "pending" ? (
          <span
            className={clsx(
              "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              pendingUrgent ? "bg-red-50 text-red-600" : "text-gray-400",
            )}
          >
            {formatMinAgo(order.createdAt)}
          </span>
        ) : null}

        {column === "preparing" ? (
          <span
            className={clsx(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
              preparingUrgent ? "bg-red-50 text-red-600" : "text-gray-500",
            )}
          >
            {preparingUrgent ? (
              <FiAlertCircle className="h-3 w-3" />
            ) : (
              <FiClock className="h-3 w-3" />
            )}
            {formatInStatus(order.acceptedAt ?? order.updatedAt)}
          </span>
        ) : null}

        {column === "ready" ? (
          <span className="rounded-md bg-brand-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {order.type === "dine-in" ? "Dine-in" : "Pickup"}
          </span>
        ) : null}
      </div>

      {column === "ready" ? (
        <div className="mt-1 flex justify-end">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
            <FiClock className="h-3 w-3" />
            {formatWaiting(order.readyAt ?? order.updatedAt)}
          </span>
        </div>
      ) : null}

      <Text
        as="p"
        size="base"
        type="bold"
        className={clsx("text-gray-900", column === "ready" ? "mt-2" : "mt-3")}
      >
        {customerOf(order)}
      </Text>
      <Text size="xs" variant="secondary" className="mt-1 leading-relaxed">
        {formatItemLines(order)}
      </Text>

      {column === "pending" ? (
        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            fullWidth
            size="sm"
            btnName="Accept"
            onClick={() => onAccept?.(order.id)}
            disabled={isActionPending}
            isLoading={isActionPending}
          />
          <Button
            type="button"
            fullWidth
            size="sm"
            variant="secondary"
            btnName="Reject"
            className="rounded-lg! border-gray-200! bg-white! py-2.5! text-gray-700!"
            onClick={() => onReject?.(order.id)}
            disabled={isActionPending}
          />
        </div>
      ) : null}

      {column === "preparing" ? (
        <Button
          type="button"
          fullWidth
          size="sm"
          variant="secondary"
          btnName="Mark Ready"
          className="mt-4! rounded-lg! border-brand-950! bg-white! py-2.5! text-brand-950! hover:bg-brand-50!"
          onClick={() => onMarkReady?.(order.id)}
          disabled={isActionPending}
          isLoading={isActionPending}
        />
      ) : null}

      {column === "ready" ? (
        <Button
          type="button"
          fullWidth
          size="sm"
          btnName="Mark Delivered"
          className="mt-4! rounded-lg! bg-teal-700! py-2.5! text-white! hover:bg-teal-800!"
          onClick={() => onMarkDelivered?.(order.id)}
          disabled={isActionPending}
          isLoading={isActionPending}
        />
      ) : null}
    </div>
  );
}
