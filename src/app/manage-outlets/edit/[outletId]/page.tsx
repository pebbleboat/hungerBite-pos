"use client";

import FieldLabel from "@/app/(dashboard)/menu/add-item/components/FieldLabel";
import ImageUploadField from "@/app/(dashboard)/menu/add-item/components/ImageUploadField";
import SectionCard from "@/app/(dashboard)/menu/add-item/components/SectionCard";
import Header from "@/components/header";
import Button from "@/shared/buttons/Button";
import EmptyState from "@/shared/EmptyState";
import Text from "@/shared/heading/Text";
import { formikFieldError } from "@/utils/functions";
import { emptyState } from "@/utils/static";
import clsx from "clsx";
import { FiImage, FiInfo, FiMapPin, FiPhone, FiSave, FiZap } from "react-icons/fi";
import { useHook } from "./useHook";

export default function EditOutletPage() {
  const {
    formik,
    handleCancel,
    isSubmitting,
    isLoading,
    isError,
    outletName,
  } = useHook();

  const nameError = formikFieldError(formik, "name");
  const addressError = formikFieldError(formik, "address");
  const cityError = formikFieldError(formik, "city");
  const phoneError = formikFieldError(formik, "phone");
  const imageError = formikFieldError(formik, "image");

  const mainContent = (() => {
    if (isLoading) {
      return (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Text size="sm" variant="secondary">
            Loading outlet…
          </Text>
        </div>
      );
    }

    if (isError) {
      return (
        <EmptyState
          pageData={[]}
          data={{
            ...emptyState,
            title: "Could not load outlet",
            subtitle: "This outlet may have been removed or is unavailable.",
            btnProps: {
              ...emptyState.btnProps,
              btnName: "Back to manage outlets",
              onClick: handleCancel,
            },
          }}
        />
      );
    }

    return (
      <form onSubmit={formik.handleSubmit}>
        <header className="mb-6">
          <Text as="h1" size="2xl" type="bold" className="text-gray-900">
            Edit Outlet
          </Text>
          <Text size="sm" variant="secondary" className="mt-1">
            {outletName
              ? `Update details for ${outletName}.`
              : "Update this location in your outlet catalogue."}
          </Text>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-5">
          <SectionCard title="Outlet Information" icon={FiInfo}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="name" required>
                  Outlet Name
                </FieldLabel>
                <input
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Downtown Kitchen"
                  className={clsx(
                    "h-11 rounded-lg border bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400",
                    nameError ? "border-red-300" : "border-gray-200",
                  )}
                />
                {nameError ? (
                  <Text size="xs" className="text-red-600">
                    {nameError}
                  </Text>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="address" required>
                  Street Address
                </FieldLabel>
                <div className="relative">
                  <FiMapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="123 Main Street"
                    className={clsx(
                      "h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400",
                      addressError ? "border-red-300" : "border-gray-200",
                    )}
                  />
                </div>
                {addressError ? (
                  <Text size="xs" className="text-red-600">
                    {addressError}
                  </Text>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="city" required>
                  City
                </FieldLabel>
                <input
                  id="city"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="San Francisco"
                  className={clsx(
                    "h-11 rounded-lg border bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400",
                    cityError ? "border-red-300" : "border-gray-200",
                  )}
                />
                {cityError ? (
                  <Text size="xs" className="text-red-600">
                    {cityError}
                  </Text>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="phone" required>
                  Phone
                </FieldLabel>
                <div className="relative">
                  <FiPhone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="+1 (555) 000-0000"
                    className={clsx(
                      "h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400",
                      phoneError ? "border-red-300" : "border-gray-200",
                    )}
                  />
                </div>
                {phoneError ? (
                  <Text size="xs" className="text-red-600">
                    {phoneError}
                  </Text>
                ) : null}
              </div>
            </div>
          </SectionCard>
          </div>

          <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
            <SectionCard
              title="Outlet Media"
              icon={FiImage}
              iconClassName="bg-violet-50 text-violet-700"
            >
              <ImageUploadField
                value={formik.values.image}
                existingImageUrl={formik.values.existingImageUrl}
                onChange={(file) => {
                  formik.setFieldValue("image", file);
                  if (!file) {
                    formik.setFieldValue("existingImageUrl", "");
                  }
                }}
                onBlur={() => formik.setFieldTouched("image", true)}
                errorMessage={imageError}
              />
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5">
                <FiZap className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <Text size="xs" className="text-amber-900">
                  High-quality photos increase conversion rates by up to 25%.
                  Image upload will be saved when the API is available.
                </Text>
              </div>
            </SectionCard>

            <div className="flex flex-col gap-2">
            <Button
              type="submit"
              fullWidth
              btnName={isSubmitting ? "Saving changes…" : "Save Changes"}
              icon={<FiSave className="h-4 w-4" />}
              className="rounded-lg! bg-brand-950! py-3! text-white! hover:bg-brand-900!"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            />
            <Button
              type="button"
              fullWidth
              variant="secondary"
              btnName="Cancel"
              className="rounded-lg! border-gray-200! bg-white! py-3! text-gray-700!"
              onClick={handleCancel}
              disabled={isSubmitting}
            />
            </div>
          </div>
        </div>
      </form>
    );
  })();

  return (
    <div className="flex min-h-screen flex-col bg-[#eef2f8]">
      <Header variant="clock-in" />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-8">
        {mainContent}
      </main>
    </div>
  );
}
