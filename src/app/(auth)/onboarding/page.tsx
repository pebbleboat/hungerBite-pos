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
  FiMapPin,
  FiPhone,
  FiShield,
  FiUser,
} from "react-icons/fi";
import OnboardingProgress from "./OnboardingProgress";
import { useHook } from "./useHook";

export default function OnboardingPage() {
  const { step, accountFormik, outletFormik, goBackToAccount, isSigningUp, isCreatingOutlet } =
    useHook();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <OnboardingProgress step={step} />

      {step === 1 ? (
        <>
          <Text as="h2" size="2xl" type="bold" className="text-gray-900">
            Create Admin Account
          </Text>
          <Text size="sm" variant="secondary" className="mt-2">
            Set up your credentials to access the HungerBite portal.
          </Text>

          <form
            onSubmit={accountFormik.handleSubmit}
            className="mt-8 flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName">
                  <Text
                    as="span"
                    size="xxs"
                    type="semibold"
                    variant="secondary"
                    className="uppercase tracking-[0.08em]"
                  >
                    First name
                  </Text>
                </label>
                <InputField
                  id="firstName"
                  name="firstName"
                  value={accountFormik.values.firstName}
                  onChange={accountFormik.handleChange}
                  onBlur={accountFormik.handleBlur}
                  errorMessage={formikFieldError(accountFormik, "firstName")}
                  placeholder="John"
                  icon={<FiUser className="h-[18px] w-[18px] text-gray-400" />}
                  className="border-gray-200 bg-white pl-10 text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName">
                  <Text
                    as="span"
                    size="xxs"
                    type="semibold"
                    variant="secondary"
                    className="uppercase tracking-[0.08em]"
                  >
                    Last name
                  </Text>
                </label>
                <InputField
                  id="lastName"
                  name="lastName"
                  value={accountFormik.values.lastName}
                  onChange={accountFormik.handleChange}
                  onBlur={accountFormik.handleBlur}
                  errorMessage={formikFieldError(accountFormik, "lastName")}
                  placeholder="Doe"
                  icon={<FiUser className="h-[18px] w-[18px] text-gray-400" />}
                  className="border-gray-200 bg-white pl-10 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email">
                <Text
                  as="span"
                  size="xxs"
                  type="semibold"
                  variant="secondary"
                  className="uppercase tracking-[0.08em]"
                >
                  Work email
                </Text>
              </label>
              <InputField
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={accountFormik.values.email}
                onChange={accountFormik.handleChange}
                onBlur={accountFormik.handleBlur}
                errorMessage={formikFieldError(accountFormik, "email")}
                placeholder="john.doe@company.com"
                icon={<FiMail className="h-[18px] w-[18px] text-gray-400" />}
                className="border-gray-200 bg-white pl-10 text-gray-900 placeholder:text-gray-400"
              />
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
                  Password
                </Text>
              </label>
              <InputField
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={accountFormik.values.password}
                onChange={accountFormik.handleChange}
                onBlur={accountFormik.handleBlur}
                errorMessage={formikFieldError(accountFormik, "password")}
                placeholder="••••••••"
                icon={<FiLock className="h-[18px] w-[18px] text-gray-400" />}
                secondaryIcon={
                  <button
                    type="button"
                    tabIndex={-1}
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
              <Text size="xs" variant="tertiary" className="italic">
                Must be at least 8 characters with one special character.
              </Text>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              className="!rounded-xl !bg-brand-950 hover:!bg-brand-900 !py-3.5"
              btnName={isSigningUp ? "Creating account…" : "Next: Outlet Details"}
              isLoading={isSigningUp}
              disabled={isSigningUp}
              secondaryIcon={
                !isSigningUp ? (
                  <FiArrowRight className="h-5 w-5 shrink-0" />
                ) : undefined
              }
            />
          </form>

          <TextWithLinks
            className="mt-6"
            text="Already have an account?"
            textProps={{ size: "sm", variant: "secondary" }}
            links={[
              {
                label: "Log In",
                link: "/login",
                className:
                  "!font-semibold !text-brand-700 hover:!text-brand-800 text-sm",
              },
            ]}
          />
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={goBackToAccount}
            className="mb-4 flex items-center gap-1.5 text-brand-700 hover:text-brand-800"
          >
            <FiArrowLeft className="h-4 w-4" />
            <Text as="span" size="sm" type="medium">
              Back
            </Text>
          </button>
          <Text as="h2" size="2xl" type="bold" className="text-gray-900">
            Outlet Details
          </Text>
          <Text size="sm" variant="secondary" className="mt-2">
            Tell us about your first location to finish setting up your portal.
          </Text>

          <form
            onSubmit={outletFormik.handleSubmit}
            className="mt-8 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="outletName">
                <Text
                  as="span"
                  size="xxs"
                  type="semibold"
                  variant="secondary"
                  className="uppercase tracking-[0.08em]"
                >
                  Outlet name
                </Text>
              </label>
              <InputField
                id="outletName"
                name="outletName"
                value={outletFormik.values.outletName}
                onChange={outletFormik.handleChange}
                onBlur={outletFormik.handleBlur}
                errorMessage={formikFieldError(outletFormik, "outletName")}
                placeholder="Downtown Kitchen"
                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="address">
                <Text
                  as="span"
                  size="xxs"
                  type="semibold"
                  variant="secondary"
                  className="uppercase tracking-[0.08em]"
                >
                  Street address
                </Text>
              </label>
              <InputField
                id="address"
                name="address"
                value={outletFormik.values.address}
                onChange={outletFormik.handleChange}
                onBlur={outletFormik.handleBlur}
                errorMessage={formikFieldError(outletFormik, "address")}
                placeholder="123 Main Street"
                icon={<FiMapPin className="h-[18px] w-[18px] text-gray-400" />}
                className="border-gray-200 bg-white pl-10 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="city">
                <Text
                  as="span"
                  size="xxs"
                  type="semibold"
                  variant="secondary"
                  className="uppercase tracking-[0.08em]"
                >
                  City
                </Text>
              </label>
              <InputField
                id="city"
                name="city"
                value={outletFormik.values.city}
                onChange={outletFormik.handleChange}
                onBlur={outletFormik.handleBlur}
                errorMessage={formikFieldError(outletFormik, "city")}
                placeholder="San Francisco"
                className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone">
                <Text
                  as="span"
                  size="xxs"
                  type="semibold"
                  variant="secondary"
                  className="uppercase tracking-[0.08em]"
                >
                  Phone
                </Text>
              </label>
              <InputField
                id="phone"
                name="phone"
                type="tel"
                value={outletFormik.values.phone}
                onChange={outletFormik.handleChange}
                onBlur={outletFormik.handleBlur}
                errorMessage={formikFieldError(outletFormik, "phone")}
                placeholder="+1 (555) 000-0000"
                icon={<FiPhone className="h-[18px] w-[18px] text-gray-400" />}
                className="border-gray-200 bg-white pl-10 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              className="!rounded-xl !bg-brand-950 hover:!bg-brand-900 !py-3.5"
              btnName={
                isCreatingOutlet ? "Creating your portal…" : "Complete setup"
              }
              isLoading={isCreatingOutlet}
              disabled={isCreatingOutlet}
              secondaryIcon={
                !isCreatingOutlet ? (
                  <FiArrowRight className="h-5 w-5 shrink-0" />
                ) : undefined
              }
            />
          </form>
        </>
      )}

      <div className="mt-10 space-y-4 border-t border-gray-100 pt-8">
        <Text
          size="xs"
          variant="tertiary"
          className="text-center leading-relaxed"
        >
          By signing up, you agree to our{" "}
          <Link
            href="#"
            className="font-medium text-brand-700 hover:text-brand-800"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="font-medium text-brand-700 hover:text-brand-800"
          >
            Privacy Policy
          </Link>
          .
        </Text>
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <FiShield className="h-4 w-4 shrink-0" />
          <Text
            as="span"
            size="xxs"
            type="semibold"
            className="uppercase tracking-[0.14em]"
          >
            Enterprise secure encryption
          </Text>
        </div>
      </div>
    </>
  );
}
