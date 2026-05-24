"use client";

import { SvgLogo } from "@/assets/svgs";
import ConfirmationModal from "@/shared/modal/ConfirmationModal";
import Text from "@/shared/heading/Text";
import clsx from "clsx";
import Link from "next/link";
import {
  FiBell,
  FiLogOut,
  FiMoon,
  FiPlay,
  FiSettings,
  FiShoppingBag,
  FiSlash,
} from "react-icons/fi";
import { NAV_ITEMS, type HeaderVariant } from "./constants";
import { useHook } from "./useHook";

type HeaderProps = {
  variant?: HeaderVariant;
};

export default function Header({ variant }: HeaderProps) {
  const {
    pathname,
    isClockIn,
    isOutletLoading,
    outletLabel,
    userName,
    userEmail,
    initials,
    showOrderControls,
    isAcceptingOrders,
    activeOverlay,
    closeOverlay,
    openOverlay,
    toggleAccountMenu,
    handleChangeOutlet,
    toggleAcceptingOrders,
    isTogglingOrders,
    endDay,
    isEndingDay,
    confirmLogout,
    isLoggingOut,
  } = useHook({ variant });

  return (
    <header
      className={clsx(
        "sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-gray-200/80 bg-white",
        isClockIn ? "px-6 py-4 lg:px-10" : "px-4 py-3 lg:px-6",
      )}
    >
      <div className="flex min-w-0 items-center gap-6">
        {isClockIn ? (
          <div className="flex items-center">
            <SvgLogo className="h-8 w-auto sm:h-10" />
            <Text
              as="span"
              size="lg"
              type="bold"
              className="-ml-1 text-brand-950"
            >
              HungerBite
            </Text>
          </div>
        ) : (
          <Link href="/" className="flex items-center">
            <SvgLogo className="h-8 w-auto sm:h-9" />
            <Text
              as="span"
              size="base"
              type="bold"
              className="-ml-1 text-brand-950"
            >
              Hungerbite
            </Text>
          </Link>
        )}

        {!isClockIn ? (
          <nav className="hidden items-center gap-5 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = item.match(pathname);
              return item.disabled ? (
                <span
                  key={item.label}
                  className="cursor-not-allowed text-sm font-medium text-gray-400"
                  title="Coming soon"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={clsx(
                    "relative pb-1 text-sm font-medium transition-colors",
                    isActive
                      ? "text-brand-950"
                      : "text-gray-600 hover:text-gray-900",
                  )}
                >
                  {item.label}
                  {isActive ? (
                    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-brand-700" />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className={clsx(
            "hidden items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5",
            isClockIn ? "sm:flex" : "lg:flex",
          )}
        >
          <FiShoppingBag className="h-3.5 w-3.5 text-brand-700" />
          <Text
            as="span"
            size="xxs"
            type="bold"
            className="uppercase tracking-widest text-brand-900"
          >
            {isOutletLoading ? "Loading…" : outletLabel}
          </Text>
        </div>

        {showOrderControls ? (
          isAcceptingOrders ? (
            <button
              type="button"
              onClick={() => openOverlay("stopOrders")}
              className="hidden items-center gap-2 rounded-lg bg-red-50 px-3.5 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 sm:inline-flex"
            >
              <FiSlash className="h-4 w-4" />
              Stop Orders
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openOverlay("startOrders")}
              className="hidden items-center gap-2 rounded-lg bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 sm:inline-flex"
            >
              <FiPlay className="h-4 w-4" />
              Start Orders
            </button>
          )
        ) : null}

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
        >
          <FiBell className="h-5 w-5" />
          {!isClockIn ? (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          ) : null}
        </button>

        {!isClockIn ? (
          <button
            type="button"
            aria-label="Settings"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          >
            <FiSettings className="h-5 w-5" />
          </button>
        ) : null}

        {isClockIn ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">
            {initials}
          </div>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={toggleAccountMenu}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-950 text-xs font-semibold text-white hover:bg-brand-900"
              aria-label="Account menu"
            >
              {initials}
            </button>

            {activeOverlay === "menu" ? (
              <>
                <button
                  type="button"
                  aria-hidden
                  tabIndex={-1}
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={closeOverlay}
                />
                <div className="absolute right-0 top-11 z-20 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                  <div className="border-b border-gray-100 px-3 py-2">
                    <Text
                      as="p"
                      size="sm"
                      type="semibold"
                      className="text-gray-900"
                    >
                      {userName}
                    </Text>
                    {userEmail ? (
                      <Text
                        as="p"
                        size="xxs"
                        variant="secondary"
                        className="mt-0.5"
                      >
                        {userEmail}
                      </Text>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={handleChangeOutlet}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FiShoppingBag className="h-4 w-4" />
                    Change outlet
                  </button>
                  <button
                    type="button"
                    onClick={() => openOverlay("endDay")}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FiMoon className="h-4 w-4" />
                    End day
                  </button>
                  <button
                    type="button"
                    onClick={() => openOverlay("logout")}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>

      {!isClockIn ? (
        <>
          <ConfirmationModal
            title="Stop accepting orders?"
            description="New orders will be paused until you start accepting again. In-progress orders are not affected."
            onSubmit={() => toggleAcceptingOrders()}
            styleHeader="flex gap-x-4 !space-y-0 items-center"
            rightBtnName="Stop Orders"
            leftBtnName="Cancel"
            type="danger"
            isOpen={activeOverlay === "stopOrders"}
            size="md"
            isLoading={isTogglingOrders}
            close={closeOverlay}
          />

          <ConfirmationModal
            title="Start accepting orders?"
            description="New orders will flow into your queue again. You can pause anytime from the navbar."
            onSubmit={() => toggleAcceptingOrders()}
            styleHeader="flex gap-x-4 !space-y-0"
            rightBtnName="Start Orders"
            leftBtnName="Cancel"
            type="success"
            isOpen={activeOverlay === "startOrders"}
            size="md"
            isLoading={isTogglingOrders}
            close={closeOverlay}
          />

          <ConfirmationModal
            title="End day for this outlet?"
            description="This closes your shift for today. You will need to clock in again to resume accepting orders."
            onSubmit={() => endDay()}
            styleHeader="flex gap-x-4 !space-y-0"
            rightBtnName="End Day"
            leftBtnName="Cancel"
            type="danger"
            isOpen={activeOverlay === "endDay"}
            size="md"
            isLoading={isEndingDay}
            close={closeOverlay}
          />

          <ConfirmationModal
            title="Confirm Logout"
            description="Are you sure you want to log out?"
            onSubmit={() => confirmLogout()}
            styleHeader="flex gap-x-4 !space-y-0 items-center"
            rightBtnName="Yes, Logout"
            leftBtnName="Back"
            type="danger"
            isOpen={activeOverlay === "logout"}
            size="md"
            isLoading={isLoggingOut}
            close={closeOverlay}
          />
        </>
      ) : null}
    </header>
  );
}

export type { HeaderVariant } from "./constants";
