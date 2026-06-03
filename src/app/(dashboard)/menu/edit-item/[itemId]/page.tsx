"use client";

import MenuItemFormLayout from "@/app/(dashboard)/menu/components/MenuItemFormLayout";
import Button from "@/shared/buttons/Button";
import EmptyState from "@/shared/EmptyState";
import Text from "@/shared/heading/Text";
import { emptyState } from "@/utils/static";
import { FiSave } from "react-icons/fi";
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

      <MenuItemFormLayout
        formik={formik}
        categoryOptions={categoryOptions}
        dietaryOptions={dietaryOptions}
        actions={
          <>
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
          </>
        }
      />
    </form>
  );
}
