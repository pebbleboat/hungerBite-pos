"use client";

import Button from "@/shared/buttons/Button";
import Text from "@/shared/heading/Text";
import TextWithLinks from "@/shared/heading/TextWithLinks";
import InputField from "@/shared/input/InputField";
import { formikFieldError } from "@/utils/functions";
import Link from "next/link";
import { useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";
import { useHook } from "./useHook";

export default function ForgotPasswordPage() {
  const {
    step,
    confirmedEmail,
    emailFormik,
    resetFormik,
    isConfirmingEmail,
    isResetting,
    goBackToEmail,
  } = useHook();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      {step === "email" ? (
        <>
          <Text as="h2" size="2xl" type="bold" className="text-gray-900">
            Forgot password?
          </Text>
          <Text size="sm" variant="secondary" className="mt-2">
            Enter your email address. We will verify your account before you set
            a new password.
          </Text>

          <form
            onSubmit={emailFormik.handleSubmit}
            className="mt-8 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="email">
                <Text
                  as="span"
                  size="xxs"
                  type="semibold"
                  variant="secondary"
                  className="uppercase tracking-[0.08em]"
                >
                  Email address
                </Text>
              </label>
              <InputField
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={emailFormik.values.email}
                onChange={emailFormik.handleChange}
                onBlur={emailFormik.handleBlur}
                errorMessage={formikFieldError(emailFormik, "email")}
                placeholder="name@company.com"
                icon={<FiMail className="h-[18px] w-[18px] text-gray-400" />}
                className="border-gray-200 bg-white pl-10 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              className="!rounded-xl !bg-brand-950 hover:!bg-brand-900 !py-3.5"
              btnName={isConfirmingEmail ? "Verifying…" : "Continue"}
              isLoading={isConfirmingEmail}
              disabled={isConfirmingEmail}
              secondaryIcon={
                !isConfirmingEmail ? (
                  <FiArrowRight className="h-5 w-5 shrink-0" />
                ) : undefined
              }
            />
          </form>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={goBackToEmail}
            className="mb-4 flex items-center gap-1.5 text-brand-700 hover:text-brand-800"
          >
            <FiArrowLeft className="h-4 w-4" />
            <Text as="span" size="sm" type="medium">
              Back
            </Text>
          </button>
          <Text as="h2" size="2xl" type="bold" className="text-gray-900">
            Set new password
          </Text>
          <Text size="sm" variant="secondary" className="mt-2">
            Your email has been confirmed. Choose a new password for your
            account.
          </Text>

          <form
            onSubmit={resetFormik.handleSubmit}
            className="mt-8 flex flex-col gap-5"
          >
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <Text
                as="span"
                size="xxs"
                type="semibold"
                variant="secondary"
                className="uppercase tracking-[0.08em]"
              >
                Confirmed email
              </Text>
              <Text
                as="span"
                size="sm"
                type="semibold"
                className="mt-1 block text-brand-950"
              >
                {confirmedEmail}
              </Text>
              <button
                type="button"
                onClick={goBackToEmail}
                className="mt-2 text-left"
              >
                <Text
                  as="span"
                  size="xs"
                  type="medium"
                  className="text-brand-700 hover:text-brand-800"
                >
                  Use a different email
                </Text>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password">
                <Text
                  as="span"
                  size="xxs"
                  type="semibold"
                  variant="secondary"
                  className="uppercase tracking-[0.08em]"
                >
                  New password
                </Text>
              </label>
              <InputField
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={resetFormik.values.password}
                onChange={resetFormik.handleChange}
                onBlur={resetFormik.handleBlur}
                errorMessage={formikFieldError(resetFormik, "password")}
                placeholder="••••••••"
                icon={<FiLock className="h-[18px] w-[18px] text-gray-400" />}
                secondaryIcon={
                  <button
                    type="button"
                    tabIndex={-1}
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <FiEye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                }
                className="border-gray-200 bg-white pl-10 pr-10 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword">
                <Text
                  as="span"
                  size="xxs"
                  type="semibold"
                  variant="secondary"
                  className="uppercase tracking-[0.08em]"
                >
                  Confirm password
                </Text>
              </label>
              <InputField
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={resetFormik.values.confirmPassword}
                onChange={resetFormik.handleChange}
                onBlur={resetFormik.handleBlur}
                errorMessage={formikFieldError(resetFormik, "confirmPassword")}
                placeholder="••••••••"
                icon={<FiLock className="h-[18px] w-[18px] text-gray-400" />}
                secondaryIcon={
                  <button
                    type="button"
                    tabIndex={-1}
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <FiEye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                }
                className="border-gray-200 bg-white pl-10 pr-10 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              className="!rounded-xl !bg-brand-950 hover:!bg-brand-900 !py-3.5"
              btnName={isResetting ? "Updating…" : "Update password"}
              isLoading={isResetting}
              disabled={isResetting}
              secondaryIcon={
                !isResetting ? (
                  <FiArrowRight className="h-5 w-5 shrink-0" />
                ) : undefined
              }
            />
          </form>
        </>
      )}

      <TextWithLinks
        className="mt-8"
        text="Remember your password?"
        textProps={{ size: "sm", variant: "secondary" }}
        links={[
          {
            label: "Back to login",
            link: "/login",
            className:
              "!font-semibold !text-brand-700 hover:!text-brand-800 text-sm",
          },
        ]}
      />
    </>
  );
};
