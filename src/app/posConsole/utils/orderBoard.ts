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

export function formatItemsSummary(order: Order): string {
  return `${order.quantity}x ${order.item}`;
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
