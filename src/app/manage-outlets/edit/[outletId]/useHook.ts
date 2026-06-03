"use client";

import {
  formValuesToUpdateOutletPayload,
  outletToFormValues,
} from "@/app/manage-outlets/utils/outletForm";
import { apiErrorMessage } from "@/lib/apiConstant";
import { getOutletById, updateOutlet } from "@/lib/apis";
import { showToast } from "@/shared/ToastMessage";
import { getAccessToken } from "@/utils/authSession";
import useSharedVariables from "@/utils/hooks/useSharedVariables";
import { queryKeys } from "@/utils/queryKeys";
import { MANAGE_OUTLETS_PATH } from "@/utils/routes";
import {
  outletEditInitialValues,
  outletEditSchema,
  type OutletEditFormValues,
} from "@/utils/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export function useHook() {
  const router = useRouter();
  const params = useParams();
  const outletId = String(params.outletId ?? "");
  const queryClient = useQueryClient();
  const accessToken = getAccessToken();
  const { selectedOutletId } = useSharedVariables();

  const { data: currentOutlet } = useQuery({
    queryKey: queryKeys.outlets.detail(selectedOutletId),
    queryFn: () => getOutletById(selectedOutletId),
    enabled: Boolean(accessToken && selectedOutletId),
  });

  const {
    data: outlet,
    isFetching,
    isError,
  } = useQuery({
    queryKey: queryKeys.outlets.detail(outletId),
    queryFn: () => getOutletById(outletId),
    enabled: Boolean(accessToken && outletId),
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

  const initialValues = useMemo(
    () => (outlet ? outletToFormValues(outlet) : outletEditInitialValues),
    [outlet],
  );

  const { mutate: submitOutlet, isPending: isSubmitting } = useMutation({
    mutationFn: (values: OutletEditFormValues) =>
      updateOutlet(outletId, formValuesToUpdateOutletPayload(values)),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.outlets.detail(outletId), updated);
      queryClient.invalidateQueries({ queryKey: queryKeys.outlets.list() });
      showToast({
        type: "success",
        title: "Outlet updated",
        subtitle: "Your outlet details were saved.",
      });
      router.push(MANAGE_OUTLETS_PATH);
    },
    onError: (err) => {
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Could not update outlet"),
      });
    },
  });

  const formik = useFormik<OutletEditFormValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema: outletEditSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => submitOutlet(values),
  });

  const handleCancel = () => router.push(MANAGE_OUTLETS_PATH);

  const isLoading = Boolean(outletId) && (isFetching || !outlet);

  return {
    formik,
    handleCancel,
    isSubmitting,
    isLoading,
    isError,
    outletName: outlet?.name ?? "",
  };
}
