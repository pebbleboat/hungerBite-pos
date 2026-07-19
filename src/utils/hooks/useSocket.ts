"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

export type SocketStatus = "idle" | "connecting" | "connected" | "error";

export type UseSocketOptions = {
  url: string;
  query?: Record<string, string | undefined>;
  enabled?: boolean;
  setup?: (socket: Socket) => void | (() => void);
};

function buildQueryKey(query: Record<string, string | undefined>): string {
  const filtered = Object.fromEntries(
    Object.entries(query).filter(
      (entry): entry is [string, string] =>
        entry[1] != null && entry[1] !== "",
    ),
  );
  return JSON.stringify(filtered);
}

export default function useSocket({
  url,
  query = {},
  enabled = true,
  setup,
}: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<SocketStatus>("idle");
  const setupRef = useRef(setup);
  setupRef.current = setup;

  const queryKey = buildQueryKey(query);

  useEffect(() => {
    if (!enabled) {
      setStatus("idle");
      return;
    }

    setStatus("connecting");

    let socket: Socket;
    try {
      socket = io(url, {
        query: JSON.parse(queryKey) as Record<string, string>,
        transports: ["websocket", "polling"],
      });
    } catch {
      setStatus("error");
      return;
    }

    socketRef.current = socket;

    socket.on("connect", () => setStatus("connected"));
    socket.on("connect_error", () => setStatus("error"));
    socket.on("disconnect", () => setStatus("idle"));

    const teardownSetup = setupRef.current?.(socket);

    return () => {
      teardownSetup?.();
      socket.disconnect();
      socketRef.current = null;
      setStatus("idle");
    };
  }, [url, enabled, queryKey]);

  return { socketRef, status };
}
