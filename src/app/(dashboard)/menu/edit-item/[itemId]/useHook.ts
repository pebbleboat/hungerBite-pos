"use client";

import {
  MENU_CATEGORY_OPTIONS,
  MENU_DIETARY_OPTIONS,
} from "@/app/(dashboard)/menu/utils/menuConstants";
import {
  formValuesToMenuItemPayload,
  menuItemToFormValues,
} from "@/app/(dashboard)/menu/utils/menuFormPayload";
import { apiErrorMessage } from "@/lib/apiConstant";
import { getMenuItemById, updateMenuItem } from "@/lib/apis";
import { showToast } from "@/shared/ToastMessage";
import useSharedVariables from "@/utils/hooks/useSharedVariables";
import { queryKeys } from "@/utils/queryKeys";
import {
  menuItemInitialValues,
  menuItemSchema,
  type MenuItemFormValues,
} from "@/utils/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const CATEGORY_OPTIONS = MENU_CATEGORY_OPTIONS.filter((o) => o.value !== "all");

export function useHook() {
  const router = useRouter();
  const params = useParams();
  const itemId = String(params.itemId ?? "");
  const queryClient = useQueryClient();
  const { selectedOutletId: outletId } = useSharedVariables();

  const {
    data: menuItem,
    isFetching,
    isError,
  } = useQuery({
    queryKey: queryKeys.menu.detail(outletId, itemId),
    queryFn: () => getMenuItemById(outletId, itemId),
    enabled: Boolean(outletId && itemId),
  });

  const initialValues = useMemo(
    () => (menuItem ? menuItemToFormValues(menuItem) : menuItemInitialValues),
    [menuItem],
  );

  const { mutate: submitItem, isPending: isSubmitting } = useMutation({
    mutationFn: async (values: MenuItemFormValues) =>
      updateMenuItem(outletId, itemId, formValuesToMenuItemPayload(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.list(outletId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.detail(outletId, itemId),
      });
      showToast({
        type: "success",
        title: "Item updated",
        subtitle: "Your menu item was saved.",
      });
      router.push("/menu");
    },
    onError: (err) => {
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Could not update menu item"),
      });
    },
  });

  const formik = useFormik<MenuItemFormValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema: menuItemSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      submitItem(values);
    },
  });

  useEffect(() => {
    if (!outletId) {
      router.replace("/menu");
    }
  }, [outletId, router]);

  const handleCancel = () => router.push("/menu");

  const isLoading = Boolean(outletId && itemId) && (isFetching || !menuItem);

  return {
    formik,
    categoryOptions: CATEGORY_OPTIONS,
    dietaryOptions: MENU_DIETARY_OPTIONS,
    handleCancel,
    isSubmitting,
    isLoading,
    isError,
    outletId,
    itemName: menuItem?.name ?? "",
  };
}
