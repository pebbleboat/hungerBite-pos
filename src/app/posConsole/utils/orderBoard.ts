import type { Order } from "@/lib/types";
import type { IconType } from "react-icons";
import {
  FiCheckCircle,
  FiClock,
  FiMenu,
  FiRotateCcw,
} from "react-icons/fi";
import { LuHourglass } from "react-icons/lu";

export type BoardColumnId = "pending" | "preparing" | "ready" | "history";

export const BOARD_COLUMNS: {
  id: BoardColumnId;
  label: string;
  icon: IconType;
}[] = [
  { id: "pending", label: "Pending", icon: LuHourglass },
  { id: "preparing", label: "Preparing", icon: FiMenu },
  { id: "ready", label: "Ready", icon: FiCheckCircle },
  { id: "history", label: "History", icon: FiRotateCcw },
];

// re-export for callers that want a default clock icon
export const ClockIcon = FiClock;

export function getOrderColumn(status: string): BoardColumnId {
  const s = status.toLowerCase();
  if (s === "pending") return "pending";
  if (s === "accepted" || s === "preparing") return "preparing";
  if (s === "ready") return "ready";
  return "history";
}

export function groupOrdersByColumn(
  orders: Order[],
): Record<BoardColumnId, Order[]> {
  const groups: Record<BoardColumnId, Order[]> = {
    pending: [],
    preparing: [],
    ready: [],
    history: [],
  };

  for (const order of orders) {
    groups[getOrderColumn(order.status)].push(order);
  }

  return groups;
}

export function formatOrderCode(orderId: string): string {
  const suffix = orderId.replace(/\W/g, "").slice(-4).toUpperCase();
  return `#HB-${suffix || "0000"}`;
}

export function getOrderTotal(order: Order): number {
  if (order.total != null && Number.isFinite(order.total)) {
    return order.total;
  }
  const sum = order.items.reduce((acc, line) => {
    const price = Number(line.price);
    const qty = Number(line.quantity);
    if (!Number.isFinite(price) || !Number.isFinite(qty)) return acc;
    return acc + price * qty;
  }, 0);
  return Number.isFinite(sum) ? sum : 0;
}

export type HistoryStatusDisplay = {
  label: string;
  toneClass: string;
  amountClass: string;
};

export function getHistoryStatusDisplay(status: string): HistoryStatusDisplay {
  const s = status.toLowerCase();

  if (s === "rejected") {
    return {
      label: "Rejected",
      toneClass: "text-red-600",
      amountClass: "text-gray-500",
    };
  }

  if (s === "delivered") {
    return {
      label: "Delivered",
      toneClass: "text-emerald-600",
      amountClass: "text-emerald-600",
    };
  }

  if (s === "collected" || s === "completed") {
    return {
      label: "Collected",
      toneClass: "text-brand-700",
      amountClass: "text-emerald-600",
    };
  }

  const label = status.trim()
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : "Completed";

  return {
    label,
    toneClass: "text-gray-600",
    amountClass: "text-gray-700",
  };
}

export function formatItemsSummary(order: Order): string {
  if (!order.items.length) return "—";
  return order.items.map((line) => `${line.quantity}x ${line.name}`).join(", ");
}

export { formatINR as formatCurrency } from "@/utils/functions";

export function formatHistoryTime(date?: Date | string | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
