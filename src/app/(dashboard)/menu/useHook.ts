"use client";

import { apiErrorMessage } from "@/lib/apiConstant";
import { deleteMenuItem, getMenuItems, getOutletById } from "@/lib/apis";
import { catalogRecordToMenuItem } from "@/app/(dashboard)/menu/utils/menuFormPayload";
import type { MenuItem } from "@/lib/types";
import { showToast } from "@/shared/ToastMessage";
import useSharedVariables from "@/utils/hooks/useSharedVariables";
import { queryKeys } from "@/utils/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export function useHook() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { selectedOutletId } = useSharedVariables();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const { data: selectedOutlet } = useQuery({
    queryKey: queryKeys.outlets.detail(selectedOutletId),
    queryFn: () => getOutletById(selectedOutletId),
    enabled: Boolean(selectedOutletId),
  });

  const { data: items = [], isFetching: isMenuFetching } = useQuery({
    queryKey: queryKeys.menu.list(selectedOutletId),
    queryFn: async () => {
      const data = await getMenuItems(selectedOutletId);
      if (!Array.isArray(data)) return [];
      return data.map(catalogRecordToMenuItem);
    },
    enabled: Boolean(selectedOutletId),
  });

  const isLoading = Boolean(selectedOutletId) && isMenuFetching;

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (status !== "all" && item.status !== status) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [items, search, category, status]);


  const handleEditItem = useCallback(
    (item: MenuItem) => {
      router.push(`/menu/edit-item/${item.id}`);
    },
    [router],
  );

  const { mutate: confirmDeleteItem, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!itemToDelete || !selectedOutletId) {
        throw new Error("No item selected");
      }
      return deleteMenuItem(selectedOutletId, itemToDelete.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.list(selectedOutletId),
      });
      if (itemToDelete) {
        queryClient.removeQueries({
          queryKey: queryKeys.menu.detail(selectedOutletId, itemToDelete.id),
        });
      }
      showToast({
        type: "success",
        title: "Item deleted",
        subtitle: itemToDelete
          ? `${itemToDelete.name} was removed from the menu.`
          : "The menu item was removed.",
      });
      setItemToDelete(null);
    },
    onError: (err) => {
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Could not delete menu item"),
      });
    },
  });

  const handleDeleteItem = useCallback((item: MenuItem) => {
    setItemToDelete(item);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    if (!isDeleting) {
      setItemToDelete(null);
    }
  }, [isDeleting]);

  return {
    selectedOutletId,
    selectedOutlet,
    items: filteredItems,
    search,
    setSearch,
    category,
    setCategory,
    status,
    setStatus,
    isLoading,
    handleEditItem,
    handleDeleteItem,
    itemToDelete,
    closeDeleteConfirm,
    confirmDeleteItem,
    isDeleting,
  };
}
