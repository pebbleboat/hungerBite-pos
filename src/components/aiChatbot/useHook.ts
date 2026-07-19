"use client";

import type {
  AiChatSocketPayload,
  ChatMessage,
} from "@/components/aiChatbot/types";
import {
  AI_CHAT_SOCKET_ERROR,
  AI_CHAT_SOCKET_EVENT,
  AI_CHAT_SOCKET_RESPONSE,
  getAiChatSocketUrl,
} from "@/lib/apiConstant";
import { getBearerToken } from "@/utils/authSession";
import useSharedVariables from "@/utils/hooks/useSharedVariables";
import useSocket from "@/utils/hooks/useSocket";
import {
  useCallback,
  useState,
  type KeyboardEvent,
} from "react";
import type { Socket } from "socket.io-client";

function createMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatAgentReply(data: unknown): string {
  if (typeof data === "string" && data.trim()) return data;
  if (data == null) return "Done.";
  return JSON.stringify(data, null, 2);
}

export function useHook() {
  const { selectedOutletId: outletId } = useSharedVariables();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const token = getBearerToken();

  const setupSocket = useCallback((socket: Socket) => {
    const onResponse = (data: unknown) => {
      setIsSending(false);
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          content: formatAgentReply(data),
          createdAt: new Date().toISOString(),
        },
      ]);
    };

    const onError = (payload: { message?: string }) => {
      setIsSending(false);
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId(),
          role: "assistant",
          content: payload.message ?? "Something went wrong.",
          createdAt: new Date().toISOString(),
        },
      ]);
    };

    socket.on(AI_CHAT_SOCKET_RESPONSE, onResponse);
    socket.on(AI_CHAT_SOCKET_ERROR, onError);

    return () => {
      socket.off(AI_CHAT_SOCKET_RESPONSE, onResponse);
      socket.off(AI_CHAT_SOCKET_ERROR, onError);
    };
  }, []);

  const { socketRef, status: socketStatus } = useSocket({
    url: getAiChatSocketUrl(),
    query: {
      outletId,
      ...(token ? { token } : {}),
    },
    enabled: isOpen,
    setup: setupSocket,
  });

  const sendPrompt = useCallback(() => {
    const text = draft.trim();
    if (!text || isSending || !socketRef.current?.connected) return;

    const payload: AiChatSocketPayload = {
      message: text,
      ...(outletId ? { outletId } : {}),
    };

    socketRef.current.emit(AI_CHAT_SOCKET_EVENT, payload);
    setMessages((prev) => [
      ...prev,
      {
        id: createMessageId(),
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft("");
    setIsSending(true);
  }, [draft, isSending, outletId, socketRef]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendPrompt();
      }
    },
    [sendPrompt],
  );

  return {
    setIsOpen,
    isOpen,
    draft,
    setDraft,
    messages,
    sendPrompt,
    handleKeyDown,
    socketStatus,
    isSending,
    isSendDisabled:
      !draft.trim() || socketStatus !== "connected" || isSending,
  };
}
