import { POS_LOGIN_AUTH_ROLE } from "@/utils/constants";
import {
  createOutlet,
  getOutletById,
  loginAsOutletOwner,
  signup,
} from "@/lib/apis";
import { SignupPayload } from "@/lib/types";
import type { CreateOutletResponse } from "@/lib/types";
import { showToast } from "@/shared/ToastMessage";
import { apiErrorMessage } from "@/lib/apiConstant";
import {
  clearOnboardingTempToken,
  getOnboardingTempToken,
  persistAuthSession,
  setOnboardingTempToken,
} from "@/utils/authSession";
import {
  onboardingAccountInitialValues,
  onboardingAccountSchema,
  onboardingOutletInitialValues,
  onboardingOutletSchema,
  type OnboardingOutletValues,
} from "@/utils/schema";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { storageKeys } from "@/utils/enum";
import { setLocalItem } from "@/utils/localstorage";

function resolveOutletId(outlet: CreateOutletResponse): string {
  if (!outlet.id) {
    throw new Error("Outlet id missing from create-outlet response");
  }
  return outlet.id;
}

export function useHook() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(() =>
    getOnboardingTempToken() ? 2 : 1,
  );

  const { mutate: submitAccount, isPending: isSigningUp } = useMutation({
    mutationFn: async (account: typeof onboardingAccountInitialValues) => {
      const payload: SignupPayload = {
        name: `${account.firstName.trim()} ${account.lastName.trim()}`.trim(),
        email: account.email.trim(),
        password: account.password,
        role: POS_LOGIN_AUTH_ROLE,
      };
      return signup(payload);
    },
    onSuccess: (res) => {
      setOnboardingTempToken(res.accessToken);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast({
        type: "success",
        title: res.message ?? "Account created",
        subtitle: "Now add your outlet details.",
      });
    },
    onError: (err) => {
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Could not create account"),
      });
    },
  });

  const { mutate: submitOutlet, isPending: isCreatingOutlet } = useMutation({
    mutationFn: async (outlet: OnboardingOutletValues) => {
      if (!getOnboardingTempToken()) {
        throw new Error("Session expired. Please complete step 1 again.");
      }

      const createdOutlet = await createOutlet({
        name: outlet.outletName.trim(),
        address: outlet.address.trim(),
        city: outlet.city.trim(),
        phone: outlet.phone.trim(),
      });

      const outletId = resolveOutletId(createdOutlet);
      const loginRes = await loginAsOutletOwner(outletId);
      return { loginRes, outlet, outletId };
    },
    onSuccess: async ({ loginRes, outlet, outletId }) => {
      try {
        persistAuthSession(loginRes.accessToken);
        clearOnboardingTempToken();
        setLocalItem(storageKeys.SELECTED_OUTLET_ID, outletId);
        const outletDetail = await getOutletById(outletId);

        showToast({
          type: "success",
          title: loginRes.message ?? "Welcome to HungerBite",
          subtitle: `${outlet.outletName} is ready to go.`,
        });
        router.push(outletDetail.status === "open" ? "/" : "/clock-in");
      } catch (err) {
        showToast({
          type: "error",
          title: apiErrorMessage(err, "Could not load outlet details"),
        });
      }
    },
    onError: (err) => {
      showToast({
        type: "error",
        title: apiErrorMessage(err, "Could not complete outlet setup"),
      });
    },
  });

  const accountFormik = useFormik({
    initialValues: onboardingAccountInitialValues,
    validationSchema: onboardingAccountSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      submitAccount(values);
    },
  });

  const outletFormik = useFormik({
    initialValues: onboardingOutletInitialValues,
    validationSchema: onboardingOutletSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      if (!getOnboardingTempToken()) {
        showToast({
          type: "error",
          title: "Please complete step 1 first.",
        });
        setStep(1);
        return;
      }
      submitOutlet(values);
    },
  });

  const goBackToAccount = useCallback(() => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return {
    step,
    accountFormik,
    outletFormik,
    goBackToAccount,
    isSigningUp,
    isCreatingOutlet,
    isSubmitting: isSigningUp || isCreatingOutlet,
  };
}
