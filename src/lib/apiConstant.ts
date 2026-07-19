import { MicroService } from "@/utils/enum";
import { isAxiosError } from "axios";

export function getServiceBaseUrl(service: MicroService) {
  switch (service) {
    case MicroService.AUTH:
      return process.env.NEXT_PUBLIC_AUTH_API_URL;
    case MicroService.POS:
      return process.env.NEXT_PUBLIC_POS_API_URL;
    case MicroService.ORDER:
      return process.env.NEXT_PUBLIC_ORDER_API_URL;
    case MicroService.CATALOG:
      return process.env.NEXT_PUBLIC_CATALOG_API_URL;
    case MicroService.AGENT:
      return (
        process.env.NEXT_PUBLIC_AGENT_API_URL ?? "http://127.0.0.1:8084"
      );

    default:
      return process.env.NEXT_PUBLIC_ORDER_API_URL;
  }
}

export const AUTH_PATHS = {
  login: "/auth/login",
  signup: "/auth/signup",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  loginAsOutlet: (outletId: string) =>
    `/auth/login-as-outlet/${encodeURIComponent(outletId)}`,
} as const;


/** Socket.io base URL for the AI assistant (ms-agent). */
export function getAiChatSocketUrl(): string {
  return (
    process.env.NEXT_PUBLIC_AI_CHAT_WS_URL ??
    process.env.NEXT_PUBLIC_AGENT_API_URL ??
    "http://127.0.0.1:8084"
  );
}

export const AI_CHAT_SOCKET_EVENT = "ai_chat_message";
export const AI_CHAT_SOCKET_RESPONSE = "ai_chat_response";
export const AI_CHAT_SOCKET_ERROR = "ai_chat_error";

export const API_PATHS = {
  createOutlet: "/create-outlet",
  outlets: "/outlets",
  outletById: (outletId: string) =>
    `/outlet/${encodeURIComponent(outletId)}`,
  startOutlet: (outletId: string) =>
    `/outlet/${encodeURIComponent(outletId)}/start`,
  toggleOutlet: (outletId: string) =>
    `/outlet/${encodeURIComponent(outletId)}/toggle`,
  endOutlet: (outletId: string) =>
    `/outlet/${encodeURIComponent(outletId)}/end`,
  addMenuItem: (outletId: string) =>
    `/outlet/${encodeURIComponent(outletId)}/add-item`,
  menuItems: (outletId: string) =>
    `/outlet/${encodeURIComponent(outletId)}/items`,
  menuItem: (outletId: string, itemId: string) =>
    `/outlet/${encodeURIComponent(outletId)}/item/${encodeURIComponent(itemId)}`,
  outletOrders: (outletId: string) =>
    `/outlet/${encodeURIComponent(outletId)}/orders`,
  orderAction: (
    outletId: string,
    orderId: string,
    action: "accept" | "reject",
  ) =>
    `/outlet/${encodeURIComponent(outletId)}/order/${encodeURIComponent(orderId)}/${action}`,
  orderReady: (outletId: string, orderId: string) =>
    `/outlet/${encodeURIComponent(outletId)}/order/${encodeURIComponent(orderId)}/ready`,
  orderCollect: (outletId: string, orderId: string) =>
    `/outlet/${encodeURIComponent(outletId)}/order/${encodeURIComponent(orderId)}/collect-order`,
} as const;




export function apiErrorMessage(e: unknown, fallback: string): string {
  if (isAxiosError(e)) {
    const body = e.response?.data;
    if (typeof body === "object" && body !== null && "message" in body) {
      const msg = (body as { message: string | string[] }).message;
      if (Array.isArray(msg)) return msg.join(", ");
      if (typeof msg === "string" && msg.trim()) return msg;
    }
    if (typeof body === "string" && body.trim()) return body;
    if (e.response) {
      return `${e.response.status} ${e.response.statusText}`;
    }
    return e.message;
  }
  if (e instanceof Error) return e.message;
  return fallback;
}
