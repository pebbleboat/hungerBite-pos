import { login } from "@/lib/apis";
import { LoginPayload } from "@/lib/types";
import { showToast } from "@/shared/ToastMessage";
import { apiErrorMessage } from "@/lib/apiConstant";
import { setTempToken } from "@/utils/authSession";
import { POS_LOGIN_AUTH_ROLE } from "@/utils/constants";
import { loginInitialValues, loginSchema } from "@/utils/schema";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

export function useHook() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (res) => {
      setTempToken(res.accessToken);
      showToast({
        type: "success",
        title: res.message ?? "Login successful",
      });
      router.replace("/select-outlet");
    },
    onError: (err) => {
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Login failed"),
      });
    },
  });

  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      mutate({
        email: values.email.trim(),
        password: values.password,
        role: POS_LOGIN_AUTH_ROLE,
      });
    },
  });

  return {
    formik,
    isSubmitting: isPending,
  };
}
