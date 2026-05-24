import { getOutletOrders, postOrderAction } from "@/lib/apis";
import {
  BOARD_COLUMNS,
  groupOrdersByColumn,
  type BoardColumnId,
} from "@/app/posConsole/utils/orderBoard";
import type { Order } from "@/lib/types";
import useSharedVariables from "@/utils/hooks/useSharedVariables";
import { queryKeys } from "@/utils/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { apiErrorMessage } from "@/lib/apiConstant";

export type SocketStatus = "idle" | "connecting" | "connected" | "error";

function diffMinutes(from?: string | null, to?: string | null): number {
  if (!from || !to) return 0;
  const start = new Date(from).getTime();
  const end = new Date(to).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.max(0, Math.floor((end - start) / 60000));
}

function formatPrepLabel(minutes: number): string {
  if (!minutes) return "—";
  if (minutes < 60) {
    const m = Math.floor(minutes);
    const s = Math.round((minutes - m) * 60);
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  }
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${h}h ${m}m`;
}

export function useHook() {
  const queryClient = useQueryClient();
  const { selectedOutletId: outletId } = useSharedVariables();
  const [activeColumn, setActiveColumn] = useState<BoardColumnId>("pending");
  const [socketStatus, setSocketStatus] = useState<SocketStatus>("idle");

  const {
    data: orders = [],
    error: ordersError,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: queryKeys.orders.outlet(outletId),
    queryFn: () => getOutletOrders(outletId),
    enabled: Boolean(outletId),
  });

  const grouped = useMemo(() => groupOrdersByColumn(orders), [orders]);

  const columnCounts = useMemo(
    () =>
      BOARD_COLUMNS.reduce(
        (acc, col) => {
          acc[col.id] = grouped[col.id].length;
          return acc;
        },
        {} as Record<BoardColumnId, number>,
      ),
    [grouped],
  );

  const liveRevenue = useMemo(() => {
    const earning = [...grouped.ready, ...grouped.history];
    return earning.reduce(
      (sum, o) => sum + (o.total ?? o.quantity * 12.5),
      0,
    );
  }, [grouped]);

  const avgPrepTimeLabel = useMemo(() => {
    const completed = [...grouped.ready, ...grouped.history];
    const samples = completed
      .map((o) => diffMinutes(o.createdAt, o.readyAt ?? o.updatedAt))
      .filter((m) => m > 0);
    if (!samples.length) return "12m 40s";
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    return formatPrepLabel(avg);
  }, [grouped]);

  const { mutate: act, isPending: isActionPending } = useMutation({
    mutationFn: ({
      orderId,
      action,
    }: {
      orderId: string;
      action: "accept" | "reject";
    }) => postOrderAction(outletId, orderId, action),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.orders.outlet(outletId),
      });
    },
  });

  const loadError = ordersError
    ? apiErrorMessage(ordersError, "Failed to load orders")
    : null;

  const invalidateOrders = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.orders.outlet(outletId),
    });
  }, [queryClient, outletId]);

  const loadOrders = useCallback(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    if (!outletId) return;

    setSocketStatus("connecting");
    let socket: Socket;

    try {
      socket = io(process.env.NEXT_PUBLIC_POS_API_URL, {
        query: { outletId },
        transports: ["websocket", "polling"],
      });
    } catch {
      setSocketStatus("error");
      return;
    }

    socket.on("connect", () => setSocketStatus("connected"));
    socket.on("connect_error", () => setSocketStatus("error"));
    socket.on("disconnect", () => setSocketStatus("idle"));
    socket.on("new_order", () => invalidateOrders());
    socket.on("update_order", () => invalidateOrders());

    return () => {
      socket.disconnect();
    };
  }, [outletId, invalidateOrders]);

  return {
    outletId,
    activeColumn,
    setActiveColumn,
    grouped,
    columnCounts,
    liveRevenue,
    avgPrepTimeLabel,
    socketStatus,
    loadError,
    loadOrders,
    handleAccept: (orderId: string) => act({ orderId, action: "accept" }),
    handleReject: (orderId: string) => act({ orderId, action: "reject" }),
    handleMarkReady: (_orderId: string) => {
      /* TODO: wire when POS API supports preparing → ready */
    },
    handleMarkDelivered: (_orderId: string) => {
      /* TODO: wire when POS API supports ready → delivered */
    },
    isOrdersLoading: isLoading || isFetching,
    isActionPending,
  };
}

export type { Order };
