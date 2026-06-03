import { getOutletById, getOutlets, loginAsOutletOwner } from "@/lib/apis";
import type { CatalogOutlet } from "@/lib/types";
import { showToast } from "@/shared/ToastMessage";
import { apiErrorMessage } from "@/lib/apiConstant";
import {
  clearAuthSession,
  clearTempToken,
  getAccessToken,
  getBearerToken,
  getTempToken,
  parseJwtPayload,
  persistAuthSession,
} from "@/utils/authSession";
import { queryKeys } from "@/utils/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { setLocalItem } from "@/utils/localstorage";
import { storageKeys } from "@/utils/enum";
import useSharedVariables from "@/utils/hooks/useSharedVariables";

export function useHook() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectingId, setSelectingId] = useState<string | null>(null);

  const tempToken = getTempToken();
  const accessToken = getAccessToken();
  const sessionToken = getBearerToken();
  const profile = sessionToken ? parseJwtPayload(sessionToken) : null;
  const displayName =
    profile?.name?.split(" ")[0] ??
    profile?.email?.split("@")[0] ??
    "there";

  const { selectedOutletId } = useSharedVariables();

  // While clocked in (current outlet open) switching outlets is not allowed.
  const { data: currentOutlet } = useQuery({
    queryKey: queryKeys.outlets.detail(selectedOutletId),
    queryFn: () => getOutletById(selectedOutletId),
    enabled: Boolean(accessToken && selectedOutletId),
  });

  useEffect(() => {
    if (selectingId) return;
    if (accessToken && currentOutlet?.status === "open") {
      router.replace("/");
    }
  }, [accessToken, currentOutlet?.status, selectingId, router]);

  const { data: outlets = [], isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.outlets.list(),
    queryFn: async () => {
      const data = await getOutlets();
      return Array.isArray(data) ? data : [];
    },
    enabled: Boolean(tempToken || accessToken),
  });

  const filteredOutlets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return outlets;
    return outlets.filter((outlet) =>
      outlet.name.toLowerCase().includes(q),
    );
  }, [outlets, search]);

  const { mutate: selectOutlet } = useMutation({
    mutationFn: async (outlet: CatalogOutlet) => {
      const loginRes = await loginAsOutletOwner(outlet.id);
      return { loginRes, outlet };
    },
    onMutate: (outlet) => {
      setSelectingId(outlet.id);
    },
    onSuccess: async ({ loginRes, outlet }) => {
      try {
        persistAuthSession(loginRes.accessToken);
        clearTempToken();
        setLocalItem(storageKeys.SELECTED_OUTLET_ID, outlet.id);
        const outletDetail = await getOutletById(outlet.id);
        queryClient.setQueryData(
          queryKeys.outlets.detail(outlet.id),
          outletDetail,
        );

        showToast({
          type: "success",
          title: loginRes.message ?? "Outlet selected",
        });
        router.push(outletDetail.status === "open" ? "/" : "/clock-in");
      } catch (err) {
        setSelectingId(null);
        showToast({
          type: "error",
          title: apiErrorMessage(err, "Could not load outlet details"),
        });
      }
    },
    onError: (err) => {
      setSelectingId(null);
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Could not sign in to outlet"),
      });
    },
  });

  const logout = () => {
    clearAuthSession();
    router.replace("/login");
  };

  return {
    displayName,
    search,
    setSearch,
    outlets: filteredOutlets,
    outletCount: filteredOutlets.length,
    isLoading,
    isError,
    refetch,
    selectingId,
    selectOutlet,
    logout,
  };
}
