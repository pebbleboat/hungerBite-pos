"use client";

import Header from "@/components/header";
import Button from "@/shared/buttons/Button";
import Text from "@/shared/heading/Text";
import InputField from "@/shared/input/InputField";
import { formikFieldError } from "@/utils/functions";
import { FiArrowLeft, FiArrowRight, FiMapPin, FiPhone } from "react-icons/fi";
import { useHook } from "./useHook";

export default function AddOutletPage() {
  const { formik, isPending, handleBack } = useHook();

  return (
    <div className="flex min-h-screen flex-col bg-[#eef2f8]">
      <Header variant="clock-in" />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="mb-6 inline-flex items-center gap-1.5 text-brand-700 hover:text-brand-800"
        >
          <FiArrowLeft className="h-4 w-4" />
          <Text as="span" size="sm" type="semibold">
            Back to manage outlets
          </Text>
        </button>

        <Text as="h1" size="2xl" type="bold" className="text-brand-950">
          Add New Outlet
        </Text>
        <Text size="sm" variant="secondary" className="mt-2">
          Register a new physical or cloud location for your business.
        </Text>

        <form
          onSubmit={formik.handleSubmit}
          className="mt-8 flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
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
              value={formik.values.outletName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={formikFieldError(formik, "outletName")}
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
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={formikFieldError(formik, "address")}
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
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={formikFieldError(formik, "city")}
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
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={formikFieldError(formik, "phone")}
              placeholder="+1 (555) 000-0000"
              icon={<FiPhone className="h-[18px] w-[18px] text-gray-400" />}
              className="border-gray-200 bg-white pl-10 text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            className="!mt-2 !rounded-xl !bg-brand-950 hover:!bg-brand-900 !py-3.5"
            btnName={isPending ? "Creating outlet…" : "Create outlet"}
            isLoading={isPending}
            disabled={isPending}
            secondaryIcon={
              !isPending ? <FiArrowRight className="h-5 w-5 shrink-0" /> : undefined
            }
          />
        </form>
      </main>
    </div>
  );
}
