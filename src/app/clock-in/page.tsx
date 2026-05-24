"use client";

import Header from "@/components/header";
import Button from "@/shared/buttons/Button";
import Loader from "@/shared/Loader";
import Text from "@/shared/heading/Text";
import { FiClock, FiPlay, FiRefreshCw, FiWifi } from "react-icons/fi";
import { useHook } from "./useHook";

export default function ClockInPage() {
  const {
    displayName,
    roleLabel,
    outletLabel,
    initials,
    timeLabel,
    dateLabel,
    isOutletLoading,
    isClockingIn,
    handleClockIn,
    handleChangeOutlet,
  } = useHook();

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f6f8]">
      <Header variant="clock-in" />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-800 ring-4 ring-white shadow-sm">
            {initials}
          </div>
          <Text as="h1" size="2xl" type="bold" className="text-brand-950">
            {displayName}
          </Text>
          <Text
            as="span"
            size="xs"
            type="semibold"
            variant="secondary"
            className="mt-2 uppercase tracking-[0.12em]"
          >
            {roleLabel} • {outletLabel}
          </Text>
        </div>

        <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_12px_40px_rgba(15,35,80,0.06)] sm:p-10">
          {isOutletLoading ? (
            <Loader className="py-16" size={28} />
          ) : (
            <>
              <div className="text-center">
                <Text
                  as="p"
                  size="4xl"
                  type="bold"
                  className="tabular-nums tracking-tight text-brand-950"
                >
                  {timeLabel}
                </Text>
                <Text size="sm" variant="secondary" className="mt-2">
                  {dateLabel}
                </Text>
              </div>

              <div className="mt-6 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-red-700">
                  <FiClock className="h-4 w-4" />
                  <Text as="span" size="xs" type="semibold">
                    Currently Clocked Out
                  </Text>
                </span>
              </div>

              <Text
                size="sm"
                variant="secondary"
                className="mx-auto mt-6 max-w-sm text-center leading-relaxed"
              >
                Clock in to begin accepting and managing orders for the shift.
              </Text>

              <Button
                type="button"
                fullWidth
                size="lg"
                className="!mt-8 !rounded-xl !bg-brand-950 hover:!bg-brand-900 !py-3.5"
                btnName={
                  isClockingIn ? "Starting shift…" : "Clock In to Start Shift"
                }
                isLoading={isClockingIn}
                disabled={isClockingIn}
                onClick={handleClockIn}
                icon={<FiPlay className="h-5 w-5" />}
              />

              <button
                type="button"
                onClick={handleChangeOutlet}
                className="mx-auto mt-5 flex items-center gap-2 text-brand-700 hover:text-brand-800"
              >
                <FiRefreshCw className="h-4 w-4" />
                <Text as="span" size="sm" type="semibold">
                  Change Outlet
                </Text>
              </button>
            </>
          )}
        </div>
      </main>

      <footer className="flex items-center justify-between border-t border-gray-200/80 bg-white px-6 py-3 text-gray-500 lg:px-10">
        <span className="flex items-center gap-2">
          <FiWifi className="h-4 w-4" />
          <Text as="span" size="xs" variant="secondary">
            Network: HQ-Staff-Secure
          </Text>
        </span>
        <Text as="span" size="xs" variant="tertiary">
          v2.4.0-prod
        </Text>
      </footer>
    </div>
  );
}
