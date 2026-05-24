"use client";

import { endOutlet, getOutletById, toggleOutlet } from "@/lib/apis";
import { apiErrorMessage } from "@/lib/apiConstant";
import { showToast } from "@/shared/ToastMessage";
import {
  clearAuthSession,
  getAccessToken,
  parseJwtPayload,
  type AuthUser,
} from "@/utils/authSession";
import { storageKeys } from "@/utils/enum";
import useSharedVariables from "@/utils/hooks/useSharedVariables";
import { getLocalItem } from "@/utils/localstorage";
import { queryKeys } from "@/utils/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { HeaderVariant, NavOverlay } from "./constants";

function resolveProfile(): AuthUser | null {
  const token = getAccessToken();
  if (token) {
    const fromJwt = parseJwtPayload(token);
    if (fromJwt) return fromJwt;
  }
  return getLocalItem<AuthUser>(storageKeys.CURRENT_USER);
}

function initialsOf(name?: string, email?: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
    }
    return (parts[0]?.slice(0, 2) ?? "HB").toUpperCase();
  }
  return (email?.slice(0, 2) ?? "HB").toUpperCase();
}

type UseHeaderOptions = {
  variant?: HeaderVariant;
};

export function useHook({ variant: variantProp }: UseHeaderOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const variant: HeaderVariant =
    variantProp ?? (pathname === "/clock-in" ? "clock-in" : "dashboard");
  const isClockIn = variant === "clock-in";

  const profile = useMemo(resolveProfile, []);
  const { selectedOutletId: outletId } = useSharedVariables();

  const { data: outlet, isLoading: isOutletLoading } = useQuery({
    queryKey: queryKeys.outlets.detail(outletId),
    queryFn: () => getOutletById(outletId),
    enabled: Boolean(outletId),
  });

  const [activeOverlay, setActiveOverlay] = useState<NavOverlay | null>(null);

  const closeOverlay = useCallback(() => setActiveOverlay(null), []);

  const invalidateOutlet = useCallback(
    (updatedOutlet: Awaited<ReturnType<typeof getOutletById>>) => {
      queryClient.setQueryData(
        queryKeys.outlets.detail(outletId),
        updatedOutlet,
      );
    },
    [queryClient, outletId],
  );

  const { mutate: toggleAcceptingOrders, isPending: isTogglingOrders } =
    useMutation({
      mutationFn: () => toggleOutlet(outletId),
      onSuccess: (updatedOutlet) => {
        invalidateOutlet(updatedOutlet);
        closeOverlay();
        showToast({
          type: "success",
          title: updatedOutlet.isAcceptingOrders
            ? "Orders started"
            : "Orders stopped",
          subtitle: updatedOutlet.isAcceptingOrders
            ? "You are now accepting new orders."
            : "You are no longer accepting new orders.",
        });
      },
      onError: (err) => {
        showToast({
          type: "error",
          title: apiErrorMessage(err, "Could not update order status"),
        });
      },
    });

  const { mutate: endDay, isPending: isEndingDay } = useMutation({
    mutationFn: () => endOutlet(outletId),
    onSuccess: (updatedOutlet) => {
      invalidateOutlet(updatedOutlet);
      closeOverlay();
      showToast({
        type: "success",
        title: "Day ended",
        subtitle: "Your outlet shift has been closed for today.",
      });
      router.replace("/clock-in");
    },
    onError: (err) => {
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Could not end day"),
      });
    },
  });

  const { mutate: confirmLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      clearAuthSession();
      router.replace("/login");
    },
  });

  const openOverlay = useCallback((overlay: NavOverlay) => {
    setActiveOverlay(overlay);
  }, []);

  const toggleAccountMenu = useCallback(() => {
    setActiveOverlay((v) => (v === "menu" ? null : "menu"));
  }, []);

  const handleChangeOutlet = useCallback(() => {
    closeOverlay();
    router.push("/select-outlet");
  }, [closeOverlay, router]);

  const userName =
    profile?.name?.trim() || profile?.email?.split("@")[0] || "Staff";
  const userEmail = profile?.email;
  const initials = initialsOf(profile?.name, profile?.email);
  const outletLabel = (outlet?.name ?? "Outlet").toUpperCase();
  const showOrderControls = !isClockIn && outlet?.status === "open";
  const isAcceptingOrders = Boolean(outlet?.isAcceptingOrders);

  return {
    pathname,
    variant,
    isClockIn,
    outlet,
    isOutletLoading,
    outletLabel,
    userName,
    userEmail,
    initials,
    showOrderControls,
    isAcceptingOrders,
    activeOverlay,
    closeOverlay,
    openOverlay,
    toggleAccountMenu,
    handleChangeOutlet,
    toggleAcceptingOrders,
    isTogglingOrders,
    endDay,
    isEndingDay,
    confirmLogout,
    isLoggingOut,
  };
}
