"use client";

import FieldLabel from "@/app/(dashboard)/menu/add-item/components/FieldLabel";
import ImageUploadField from "@/app/(dashboard)/menu/add-item/components/ImageUploadField";
import SectionCard from "@/app/(dashboard)/menu/add-item/components/SectionCard";
import Button from "@/shared/buttons/Button";
import BtnGroup from "@/shared/buttons/BtnGroup";
import EmptyState from "@/shared/EmptyState";
import Text from "@/shared/heading/Text";
import Switcher from "@/shared/input/Switcher";
import { CURRENCY_SYMBOL, formikFieldError } from "@/utils/functions";
import { emptyState } from "@/utils/static";
import clsx from "clsx";
import {
  FiChevronDown,
  FiDollarSign,
  FiImage,
  FiInfo,
  FiSave,
  FiZap,
} from "react-icons/fi";
import { useHook } from "./useHook";

export default function EditMenuItemPage() {
  const {
    formik,
    categoryOptions,
    dietaryOptions,
    handleCancel,
    isSubmitting,
    isLoading,
    isError,
    itemName,
  } = useHook();

  const nameError = formikFieldError(formik, "name");
  const descriptionError = formikFieldError(formik, "description");
  const categoryError = formikFieldError(formik, "category");
  const dietaryError = formikFieldError(formik, "dietary");
  const priceError = formikFieldError(formik, "price");
  const imageError = formikFieldError(formik, "image");

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[40vh] w-full max-w-7xl items-center justify-center px-4 py-6 lg:px-8">
        <Text size="sm" variant="secondary">
          Loading menu item…
        </Text>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
        <EmptyState
          pageData={[]}
          data={{
            ...emptyState,
            title: "Could not load item",
            subtitle: "This menu item may have been removed or is unavailable.",
            btnProps: {
              ...emptyState.btnProps,
              btnName: "Back to menu",
              onClick: handleCancel,
            },
          }}
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8"
    >
      <header className="mb-6">
        <Text as="h1" size="2xl" type="bold" className="text-gray-900">
          Edit Menu Item
        </Text>
        <Text size="sm" variant="secondary" className="mt-1">
          {itemName
            ? `Update details for ${itemName}.`
            : "Update this item in your digital menu catalogue."}
        </Text>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-5">
          <SectionCard title="Basic Information" icon={FiInfo}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="name" required>
                  Item Name
                </FieldLabel>
                <input
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Signature Truffle Burger"
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
                <FieldLabel htmlFor="description" required>
                  Description
                </FieldLabel>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Briefly describe the ingredients, preparation, and flavor profile..."
                  className={clsx(
                    "min-h-[7rem] resize-y rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400",
                    descriptionError ? "border-red-300" : "border-gray-200",
                  )}
                />
                {descriptionError ? (
                  <Text size="xs" className="text-red-600">
                    {descriptionError}
                  </Text>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="category" required>
                  Category
                </FieldLabel>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={clsx(
                      "h-11 w-full appearance-none rounded-lg border bg-white pl-3 pr-9 text-sm outline-none",
                      formik.values.category ? "text-gray-900" : "text-gray-400",
                      categoryError ? "border-red-300" : "border-gray-200",
                    )}
                  >
                    <option value="" disabled hidden>
                      Select a menu category...
                    </option>
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
                {categoryError ? (
                  <Text size="xs" className="text-red-600">
                    {categoryError}
                  </Text>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <BtnGroup
                  label="Dietary"
                  required
                  buttons={dietaryOptions.map((opt) => ({
                    label: opt.label,
                    value: opt.value,
                  }))}
                  selected={formik.values.dietary}
                  onClick={(btn) => {
                    formik.setFieldValue("dietary", btn.value);
                    formik.setFieldTouched("dietary", true);
                  }}
                  wrapperClass="w-full"
                  className={clsx(
                    "w-full!",
                    dietaryError && "border-red-300!",
                  )}
                  styleBtn="!flex-1 !px-2 !text-xs sm:!text-sm"
                />
                {dietaryError ? (
                  <Text size="xs" className="text-red-600">
                    {dietaryError}
                  </Text>
                ) : null}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Pricing & Status"
            icon={FiDollarSign}
            iconClassName="bg-emerald-50 text-emerald-700"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="price" required>
                  Price ({CURRENCY_SYMBOL})
                </FieldLabel>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    {CURRENCY_SYMBOL}
                  </span>
                  <input
                    id="price"
                    name="price"
                    inputMode="decimal"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="0.00"
                    className={clsx(
                      "h-11 w-full rounded-lg border bg-white pl-8 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400",
                      priceError ? "border-red-300" : "border-gray-200",
                    )}
                  />
                </div>
                {priceError ? (
                  <Text size="xs" className="text-red-600">
                    {priceError}
                  </Text>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <FieldLabel>Status</FieldLabel>
                <div className="flex h-11 items-center justify-between rounded-lg border border-gray-200 bg-white px-3">
                  <Text as="span" size="sm" className="text-gray-900">
                    Available for Ordering
                  </Text>
                  <Switcher
                    size="sm"
                    checked={formik.values.isAvailable}
                    onChange={(v) => formik.setFieldValue("isAvailable", v)}
                  />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="flex flex-col gap-5">
          <SectionCard
            title="Item Media"
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
}
