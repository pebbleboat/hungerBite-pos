"use client";

import {
  MENU_CATEGORY_OPTIONS,
  MENU_DIETARY_OPTIONS,
} from "@/app/(dashboard)/menu/utils/menuConstants";
import { apiErrorMessage } from "@/lib/apiConstant";
import { addMenuItem } from "@/lib/apis";
import { AddMenuItemPayload } from "@/lib/types";
import { showToast } from "@/shared/ToastMessage";
import useSharedVariables from "@/utils/hooks/useSharedVariables";
import { queryKeys } from "@/utils/queryKeys";
import {
  menuItemInitialValues,
  menuItemSchema,
  type MenuItemFormValues,
} from "@/utils/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

const CATEGORY_OPTIONS = MENU_CATEGORY_OPTIONS.filter((o) => o.value !== "all");

export function useHook() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { selectedOutletId: outletId } = useSharedVariables();

  const { mutate: submitItem, isPending: isSubmitting } = useMutation({
    mutationFn: async (values: MenuItemFormValues) => {
      const payload: AddMenuItemPayload = {
        name: values.name.trim(),
        description: values.description.trim(),
        category: values.category,
        dietary: values.dietary,
        price: Number(values.price),
        status: values.isAvailable ? "available" : "unavailable",
      };
      return addMenuItem(outletId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.list(outletId),
      });
      showToast({
        type: "success",
        title: "Item added",
        subtitle: "Your menu item was saved to the catalogue.",
      });
      router.push("/menu");
    },
    onError: (err) => {
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Could not add menu item"),
      });
    },
  });

  const formik = useFormik<MenuItemFormValues>({
    initialValues: menuItemInitialValues,
    validationSchema: menuItemSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      submitItem(values);
    },
  });

  const handleCancel = () => router.push("/menu");

  return {
    formik,
    categoryOptions: CATEGORY_OPTIONS,
    dietaryOptions: MENU_DIETARY_OPTIONS,
    handleCancel,
    isSubmitting,
    outletId,
  };
}
