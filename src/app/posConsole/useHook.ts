import {
  getOutletOrders,
  postOrderAction,
  postOrderCollect,
  postOrderReady,
} from "@/lib/apis";
import { showToast } from "@/shared/ToastMessage";
import {
  BOARD_COLUMNS,
  getOrderTotal,
  type BoardColumnId,
} from "@/app/posConsole/utils/orderBoard";
import type { OutletOrdersBoard } from "@/lib/types";
import useSharedVariables from "@/utils/hooks/useSharedVariables";
import { queryKeys } from "@/utils/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { apiErrorMessage } from "@/lib/apiConstant";

export type SocketStatus = "idle" | "connecting" | "connected" | "error";

const EMPTY_ORDERS_BOARD: OutletOrdersBoard = {
  pending: [],
  preparing: [],
  ready: [],
  history: [],
};

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
    data: ordersBoard = EMPTY_ORDERS_BOARD,
    error: ordersError,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: queryKeys.orders.outlet(outletId),
    queryFn: async () => {
      const data = await getOutletOrders(outletId);
      if (!data) return EMPTY_ORDERS_BOARD;
      return {
        pending: data.pending ?? [],
        preparing: data.preparing ?? [],
        ready: data.ready ?? [],
        history: data.history ?? [],
      };
    },
    enabled: Boolean(outletId),
  });

  const grouped = ordersBoard;

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
    return earning.reduce((sum, o) => sum + getOrderTotal(o), 0);
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

  const invalidateOrdersQuery = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.orders.outlet(outletId),
    });
  }, [queryClient, outletId]);

  const { mutate: act, isPending: isActPending } = useMutation({
    mutationFn: ({
      orderId,
      action,
    }: {
      orderId: string;
      action: "accept" | "reject";
    }) => postOrderAction(outletId, orderId, action),
    onSuccess: invalidateOrdersQuery,
    onError: (err) => {
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Could not update order"),
      });
    },
  });

  const { mutate: markReady, isPending: isMarkReadyPending } = useMutation({
    mutationFn: (orderId: string) => postOrderReady(outletId, orderId),
    onSuccess: invalidateOrdersQuery,
    onError: (err) => {
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Could not mark order ready"),
      });
    },
  });

  const { mutate: collectOrder, isPending: isCollectPending } = useMutation({
    mutationFn: (orderId: string) => postOrderCollect(outletId, orderId),
    onSuccess: invalidateOrdersQuery,
    onError: (err) => {
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Could not mark order delivered"),
      });
    },
  });

  const loadError = ordersError
    ? apiErrorMessage(ordersError, "Failed to load orders")
    : null;

  const invalidateOrders = invalidateOrdersQuery;

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
    handleMarkReady: (orderId: string) => markReady(orderId),
    handleMarkDelivered: (orderId: string) => collectOrder(orderId),
    isOrdersLoading: isLoading || isFetching,
    isActionPending: isActPending || isMarkReadyPending || isCollectPending,
  };
}

export type { Order } from "@/lib/types";
