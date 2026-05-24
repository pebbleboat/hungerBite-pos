import { requestPasswordReset, resetPassword } from "@/lib/apis";
import { showToast } from "@/shared/ToastMessage";
import { apiErrorMessage } from "@/lib/apiConstant";
import { POS_LOGIN_AUTH_ROLE } from "@/utils/constants";
import {
  forgotPasswordEmailInitialValues,
  forgotPasswordEmailSchema,
  resetPasswordInitialValues,
  resetPasswordSchema,
} from "@/utils/schema";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type ForgotPasswordStep = "email" | "reset";

export function useHook() {
  const router = useRouter();
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [confirmedEmail, setConfirmedEmail] = useState("");

  const { mutate: confirmEmail, isPending: isConfirmingEmail } = useMutation({
    mutationFn: (email: string) =>
      requestPasswordReset({
        email: email.trim(),
        role: POS_LOGIN_AUTH_ROLE,
      }),
    onSuccess: (res, email) => {
      setConfirmedEmail(email.trim());
      setStep("reset");
      showToast({
        type: "success",
        title: res.message ?? "Email confirmed",
        subtitle: "Set your new password below.",
      });
    },
    onError: (err) => {
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Could not verify email"),
      });
    },
  });

  const { mutate: submitReset, isPending: isResetting } = useMutation({
    mutationFn: (password: string) =>
      resetPassword({
        email: confirmedEmail,
        password,
        role: POS_LOGIN_AUTH_ROLE,
      }),
    onSuccess: (res) => {
      showToast({
        type: "success",
        title: res.message ?? "Password updated",
        subtitle: "You can sign in with your new password.",
      });
      router.replace("/login");
    },
    onError: (err) => {
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Could not reset password"),
      });
    },
  });

  const emailFormik = useFormik({
    initialValues: forgotPasswordEmailInitialValues,
    validationSchema: forgotPasswordEmailSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      confirmEmail(values.email.trim());
    },
  });

  const resetFormik = useFormik({
    initialValues: resetPasswordInitialValues,
    validationSchema: resetPasswordSchema,
    validateOnBlur: true,
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      submitReset(values.password);
    },
  });

  const goBackToEmail = () => {
    setStep("email");
    resetFormik.resetForm();
  };

  return {
    step,
    confirmedEmail,
    emailFormik,
    resetFormik,
    isConfirmingEmail,
    isResetting,
    goBackToEmail,
  };
}
