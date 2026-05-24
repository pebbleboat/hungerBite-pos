"use client";

import Button from "@/shared/buttons/Button";
import Text from "@/shared/heading/Text";
import TextWithLinks from "@/shared/heading/TextWithLinks";
import InputField from "@/shared/input/InputField";
import { formikFieldError } from "@/utils/functions";
import Link from "next/link";
import { useState } from "react";
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { useHook } from "./useHook";

export default function LoginPage() {
  const { formik, isSubmitting } = useHook();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Text as="h2" size="2xl" type="bold" className="text-gray-900">
        Welcome back
      </Text>
      <Text size="sm" variant="secondary" className="mt-2">
        Sign in to your HungerBite POS Admin portal.
      </Text>

      <form
        onSubmit={formik.handleSubmit}
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
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={formikFieldError(formik, "email")}
            placeholder="name@company.com"
            icon={<FiMail className="h-[18px] w-[18px] text-gray-400" />}
            className="border-gray-200 bg-white pl-10 text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="password">
              <Text
                as="span"
                size="xxs"
                type="semibold"
                variant="secondary"
                className="uppercase tracking-[0.08em]"
              >
                Password
              </Text>
            </label>
            <Link href="/forgot-password">
              <Text
                as="span"
                size="xs"
                type="medium"
                className="text-brand-700 hover:text-brand-800"
              >
                Forgot Password?
              </Text>
            </Link>
          </div>
          <InputField
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={formikFieldError(formik, "password")}
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

        <Button
          type="submit"
          fullWidth
          size="lg"
          className="!rounded-xl !bg-brand-950 hover:!bg-brand-900 !py-3.5"
          btnName={isSubmitting ? "Signing in…" : "Login"}
          isLoading={isSubmitting}
          disabled={isSubmitting}
          secondaryIcon={
            !isSubmitting ? (
              <FiArrowRight className="h-5 w-5 shrink-0" />
            ) : undefined
          }
        />
      </form>

      <TextWithLinks
        className="mt-8"
        text="New to HungerBite?"
        textProps={{ size: "sm", variant: "secondary" }}
        links={[
          {
            label: "Get started",
            link: "/onboarding",
            className:
              "!font-semibold !text-brand-700 hover:!text-brand-800 text-sm",
          },
        ]}
      />
    </>
  );
};
