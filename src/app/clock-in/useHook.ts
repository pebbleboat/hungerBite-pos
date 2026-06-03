"use client";

import { getOutletById, startOutlet } from "@/lib/apis";
import { apiErrorMessage } from "@/lib/apiConstant";
import { showToast } from "@/shared/ToastMessage";
import type { AuthUser } from "@/utils/authSession";
import { getAccessToken, parseJwtPayload } from "@/utils/authSession";
import { storageKeys } from "@/utils/enum";
import useSharedVariables from "@/utils/hooks/useSharedVariables";
import { getLocalItem } from "@/utils/localstorage";
import { queryKeys } from "@/utils/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

function formatRoleLabel(role?: string): string {
  if (!role) return "STAFF";
  return role.replace(/_/g, " ").toUpperCase();
}

function getInitials(name?: string, email?: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
    }
    return (parts[0]?.slice(0, 2) ?? "HB").toUpperCase();
  }
  return (email?.slice(0, 2) ?? "HB").toUpperCase();
}

export function useHook() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [now, setNow] = useState(() => new Date());

  const profile =
    (getAccessToken() ? parseJwtPayload(getAccessToken()!) : null) ??
    getLocalItem<AuthUser>(storageKeys.CURRENT_USER);

  const { selectedOutletId: outletId } = useSharedVariables();

  const { data: outlet, isLoading: isOutletLoading } = useQuery({
    queryKey: queryKeys.outlets.detail(outletId),
    queryFn: () => getOutletById(outletId),
    enabled: Boolean(outletId),
  });

  const { mutate: clockIn, isPending: isClockingIn } = useMutation({
    mutationFn: () => startOutlet(outletId),
    onSuccess: (updatedOutlet) => {
      queryClient.setQueryData(
        queryKeys.outlets.detail(outletId),
        updatedOutlet,
      );
      router.replace("/");
    },
    onError: (err) => {
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Could not clock in"),
      });
    },
  });

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      router.replace("/select-outlet");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [router]);

  useEffect(() => {
    if (!outletId) {
      router.replace("/select-outlet");
    }
  }, [outletId, router]);

  useEffect(() => {
    if (outlet?.status !== "open") return;
    router.replace("/");
  }, [outlet?.status, router]);

  const timeLabel = useMemo(
    () =>
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    [now],
  );

  const dateLabel = useMemo(
    () =>
      now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    [now],
  );

  const displayName = profile?.name ?? profile?.email?.split("@")[0] ?? "Staff";
  const roleLabel = formatRoleLabel(profile?.role);
  const outletLabel = (outlet?.name ?? "Outlet").toUpperCase();
  const initials = getInitials(profile?.name, profile?.email);

  const handleClockIn = useCallback(() => {
    clockIn();
  }, [clockIn]);

  const handleChangeOutlet = useCallback(() => {
    router.push("/select-outlet");
  }, [router]);

  return {
    displayName,
    roleLabel,
    outletLabel,
    initials,
    timeLabel,
    dateLabel,
    isOutletLoading,
    isClockingIn,
    handleClockIn,
    handleChangeOutlet,
  };
}
