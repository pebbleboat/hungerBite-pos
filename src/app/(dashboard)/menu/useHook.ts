"use client";

import { getMenuItems, getOutletById } from "@/lib/apis";
import type { MenuItem } from "@/lib/types";
import { showToast } from "@/shared/ToastMessage";
import useSharedVariables from "@/utils/hooks/useSharedVariables";
import { queryKeys } from "@/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

export function useHook() {
  const { selectedOutletId } = useSharedVariables();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const { data: selectedOutlet } = useQuery({
    queryKey: queryKeys.outlets.detail(selectedOutletId),
    queryFn: () => getOutletById(selectedOutletId),
    enabled: Boolean(selectedOutletId),
  });

  const { data: items = [], isFetching: isMenuFetching } = useQuery({
    queryKey: queryKeys.menu.list(selectedOutletId),
    queryFn: () => getMenuItems(selectedOutletId),
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


  const handleEditItem = useCallback((item: MenuItem) => {
    showToast({
      type: "warning",
      title: `Edit ${item.name}`,
      subtitle: "Edit flow will be wired in a follow-up.",
    });
  }, []);

  const handleDeleteItem = useCallback((item: MenuItem) => {
    showToast({
      type: "warning",
      title: `Delete ${item.name}`,
      subtitle: "Delete flow will be wired in a follow-up.",
    });
  }, []);

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
  };
}
