"use client";

import MenuItemFormLayout from "@/app/(dashboard)/menu/components/MenuItemFormLayout";
import Button from "@/shared/buttons/Button";
import Text from "@/shared/heading/Text";
import { FiPlus } from "react-icons/fi";
import { useHook } from "./useHook";

export default function AddMenuItemPage() {
  const { formik, categoryOptions, dietaryOptions, handleCancel, isSubmitting } =
    useHook();

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8"
    >
      <header className="mb-6">
        <Text as="h1" size="2xl" type="bold" className="text-gray-900">
          Add New Menu Item
        </Text>
        <Text size="sm" variant="secondary" className="mt-1">
          Fill out the details below to add a new item to your digital menu
          catalogue.
        </Text>
      </header>

      <MenuItemFormLayout
        formik={formik}
        categoryOptions={categoryOptions}
        dietaryOptions={dietaryOptions}
        actions={
          <>
            <Button
              type="submit"
              fullWidth
              btnName={isSubmitting ? "Adding item…" : "Add Item to Menu"}
              icon={<FiPlus className="h-4 w-4" />}
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
          </>
        }
      />
    </form>
  );
}
