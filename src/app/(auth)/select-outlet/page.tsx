"use client";

import OutletSelectCard from "@/shared/cards/OutletSelectCard";
import Loader from "@/shared/Loader";
import Text from "@/shared/heading/Text";
import InputField from "@/shared/input/InputField";
import { FiLogOut, FiSearch } from "react-icons/fi";
import { useHook } from "./useHook";

export default function SelectOutletPage() {
  const {
    displayName,
    search,
    setSearch,
    outlets,
    outletCount,
    isLoading,
    isError,
    refetch,
    selectingId,
    selectOutlet,
    logout,
  } = useHook();

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <Text as="h2" size="2xl" type="bold" className="text-gray-900">
            Select your outlet
          </Text>
          <Text size="sm" variant="secondary" className="mt-2">
            Welcome back, {displayName}. Choose the outlet you want to manage
            today.
          </Text>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-brand-700 hover:bg-gray-50"
        >
          <FiLogOut className="h-4 w-4" />
          <Text as="span" size="sm" type="semibold">
            Logout
          </Text>
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-5">
        <InputField
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by outlet name…"
          icon={<FiSearch className="h-[18px] w-[18px] text-gray-400" />}
          className="border-gray-200 bg-white pl-10 text-gray-900 placeholder:text-gray-400"
        />

        {isLoading ? (
          <Loader className="py-12" size={28} />
        ) : isError ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-center">
            <Text size="sm" variant="secondary">
              Could not load outlets.
            </Text>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Try again
            </button>
          </div>
        ) : outletCount === 0 ? (
          <Text variant="secondary" className="py-8 text-center">
            {search.trim()
              ? "No outlets match your search."
              : "No outlets available yet."}
          </Text>
        ) : (
          <div className="flex max-h-[min(420px,50vh)] flex-col gap-3 overflow-y-auto pr-1">
            {outlets.map((outlet) => (
              <OutletSelectCard
                key={outlet.id}
                outlet={outlet}
                onSelect={selectOutlet}
                isSelecting={selectingId === outlet.id}
                disabled={Boolean(selectingId && selectingId !== outlet.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
