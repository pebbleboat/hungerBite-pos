"use client";

import { createOutlet } from "@/lib/apis";
import { apiErrorMessage } from "@/lib/apiConstant";
import { showToast } from "@/shared/ToastMessage";
import { getAccessToken } from "@/utils/authSession";
import {
  onboardingOutletInitialValues,
  onboardingOutletSchema,
} from "@/utils/schema";
import { queryKeys } from "@/utils/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useHook() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
    }
  }, [router]);

  const { mutate: submitOutlet, isPending } = useMutation({
    mutationFn: (values: typeof onboardingOutletInitialValues) =>
      createOutlet({
        name: values.outletName.trim(),
        address: values.address.trim(),
        city: values.city.trim(),
        phone: values.phone.trim(),
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.outlets.list() });
      showToast({
        type: "success",
        title: "Outlet created",
      });
      router.replace("/manage-outlets");
    },
    onError: (err) => {
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Could not create outlet"),
      });
    },
  });

  const formik = useFormik({
    initialValues: onboardingOutletInitialValues,
    validationSchema: onboardingOutletSchema,
    onSubmit: (values) => submitOutlet(values),
  });

  const handleBack = () => {
    router.replace("/manage-outlets");
  };

  return {
    formik,
    isPending,
    handleBack,
  };
}
