"use client";

import { deleteOutlet, getOutletById, getOutlets } from "@/lib/apis";
import type { CatalogOutlet } from "@/lib/types";
import { showToast } from "@/shared/ToastMessage";
import { apiErrorMessage } from "@/lib/apiConstant";
import { getAccessToken } from "@/utils/authSession";
import { storageKeys } from "@/utils/enum";
import useSharedVariables from "@/utils/hooks/useSharedVariables";
import { removeLocalItem } from "@/utils/localstorage";
import { queryKeys } from "@/utils/queryKeys";
import { manageOutletEditPath } from "@/utils/routes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useHook() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();
  const { selectedOutletId } = useSharedVariables();
  const [outletToDelete, setOutletToDelete] = useState<CatalogOutlet | null>(
    null,
  );

  const { data: currentOutlet } = useQuery({
    queryKey: queryKeys.outlets.detail(selectedOutletId),
    queryFn: () => getOutletById(selectedOutletId),
    enabled: Boolean(accessToken && selectedOutletId),
  });

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
      return;
    }
    if (currentOutlet?.status === "open") {
      router.replace("/");
    }
  }, [accessToken, currentOutlet?.status, router]);

  const {
    data: outlets = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.outlets.list(),
    queryFn: async () => {
      const data = await getOutlets();
      return Array.isArray(data) ? data : [];
    },
    enabled: Boolean(accessToken),
  });

  const { mutate: confirmDeleteOutlet, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!outletToDelete) {
        throw new Error("No outlet selected");
      }
      return deleteOutlet(outletToDelete.id);
    },
    onSuccess: () => {
      const deletedId = outletToDelete?.id;
      queryClient.invalidateQueries({ queryKey: queryKeys.outlets.list() });
      if (deletedId) {
        queryClient.removeQueries({
          queryKey: queryKeys.outlets.detail(deletedId),
        });
      }
      if (deletedId && deletedId === selectedOutletId) {
        removeLocalItem(storageKeys.SELECTED_OUTLET_ID);
      }
      showToast({
        type: "success",
        title: "Outlet deleted",
        subtitle: outletToDelete?.name
          ? `${outletToDelete.name} was removed.`
          : undefined,
      });
      setOutletToDelete(null);
    },
    onError: (err) => {
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Could not delete outlet"),
      });
    },
  });

  const handleAddOutlet = useCallback(() => {
    router.push("/manage-outlets/add");
  }, [router]);

  const handleEditOutlet = useCallback(
    (outlet: CatalogOutlet) => {
      router.push(manageOutletEditPath(outlet.id));
    },
    [router],
  );

  const handleDeleteOutlet = useCallback((outlet: CatalogOutlet) => {
    setOutletToDelete(outlet);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setOutletToDelete(null);
  }, []);

  const handleBackToClockIn = useCallback(() => {
    router.replace("/clock-in");
  }, [router]);

  return {
    outlets,
    isLoading,
    isError,
    refetch,
    handleAddOutlet,
    handleEditOutlet,
    handleDeleteOutlet,
    handleBackToClockIn,
    outletToDelete,
    closeDeleteConfirm,
    confirmDeleteOutlet,
    isDeleting,
  };
}
