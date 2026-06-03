"use client";

import Header from "@/components/header";
import Button from "@/shared/buttons/Button";
import EmptyState from "@/shared/EmptyState";
import Text from "@/shared/heading/Text";
import ConfirmationModal from "@/shared/modal/ConfirmationModal";
import { emptyState } from "@/utils/static";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import AddOutletPlaceholderCard from "./components/AddOutletPlaceholderCard";
import OutletManageCard from "./components/OutletManageCard";
import { useHook } from "./useHook";

export default function ManageOutletsPage() {
  const {
    outlets,
    isLoading,
    isError,
    refetch,
    handleAddOutlet,
    handleEditOutlet,
    handleDeleteOutlet,
    handleBackToClockIn,
    outletToDelete,
    closeDeleteConfirm,
    confirmDeleteOutlet,
    isDeleting,
  } = useHook();

  return (
    <div className="flex min-h-screen flex-col bg-[#eef2f8]">
      <Header variant="clock-in" />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-8">
        <button
          type="button"
          onClick={handleBackToClockIn}
          className="mb-6 inline-flex items-center gap-1.5 text-brand-700 hover:text-brand-800"
        >
          <FiArrowLeft className="h-4 w-4" />
          <Text as="span" size="sm" type="semibold">
            Back to clock in
          </Text>
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Text as="h1" size="2xl" type="bold" className="text-brand-950">
              Manage Outlets
            </Text>
            <Text size="sm" variant="secondary" className="mt-2 max-w-xl">
              Configure and monitor all your physical and digital store
              locations.
            </Text>
          </div>
          <Button
            type="button"
            btnName="Add New Outlet"
            icon={<FiPlus className="h-4 w-4" />}
            className="!shrink-0 !rounded-xl !bg-brand-950 hover:!bg-brand-900"
            onClick={handleAddOutlet}
          />
        </div>

        <EmptyState
          pageData={isLoading ? null : isError ? [] : outlets}
          loaderClass="py-20"
          data={{
            title: "No outlets yet",
            subtitle:
              "Register your first physical or cloud location to get started.",
            btnProps: {
              ...emptyState.btnProps,
              btnName: "Add New Outlet",
              icon: <FiPlus className="h-4 w-4 text-white" />,
              onClick: handleAddOutlet,
            },
          }}
        >
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {outlets.map((outlet, index) => (
              <OutletManageCard
                key={outlet.id}
                outlet={outlet}
                posLabel={`POS #${outlet.id.slice(-6)}`}
                onEdit={handleEditOutlet}
                onDelete={handleDeleteOutlet}
              />
            ))}
            <AddOutletPlaceholderCard onClick={handleAddOutlet} />
          </div>
        </EmptyState>
      </main>

      <ConfirmationModal
        title="Delete outlet?"
        description={
          outletToDelete
            ? `"${outletToDelete.name}" will be permanently removed. This cannot be undone.`
            : "This outlet will be permanently removed."
        }
        onSubmit={() => confirmDeleteOutlet()}
        styleHeader="flex gap-x-4 !space-y-0 items-center"
        rightBtnName="Delete Outlet"
        leftBtnName="Cancel"
        type="danger"
        isOpen={Boolean(outletToDelete)}
        size="md"
        isLoading={isDeleting}
        close={closeDeleteConfirm}
      />
    </div>
  );
}
