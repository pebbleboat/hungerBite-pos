"use client";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSeparator,
} from "@headlessui/react";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

type MenuItemsAnchor = NonNullable<ComponentProps<typeof MenuItems>["anchor"]>;

export type MenuPopoverItem =
  | {
      type: "item";
      id: string;
      label: string;
      onClick: () => void;
      icon?: ReactNode;
      variant?: "default" | "danger";
      disabled?: boolean;
      keepMenuOpen?: boolean;
    }
  | { type: "separator"; id: string };

export interface MenuPopoverProps {
  children: ReactNode;
  items: MenuPopoverItem[];
  menuButtonClassName?: string;
  menuItemsClassName?: string;
  anchor?: MenuItemsAnchor;
  className?: string;
  onMenuButtonClick?: () => void;
}

const defaultButtonClasses =
  "flex w-full cursor-pointer rounded-lg outline-none transition-colors cursor-pointer";

const defaultPanelClasses =
  "z-50 mt-2 w-52 origin-top-right rounded-xl border border-gray-200 bg-white shadow-lg outline-none transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0";

export default function MenuPopover({
  children,
  items,
  menuButtonClassName,
  menuItemsClassName,
  anchor = "bottom end",
  className,
  onMenuButtonClick,
}: MenuPopoverProps) {
  return (
    <Menu as="div" className={clsx("relative", className)}>
      <MenuButton
        as="div"
        className={clsx(defaultButtonClasses, menuButtonClassName)}
        onClick={() => onMenuButtonClick?.()}
      >
        {children}
      </MenuButton>

      <MenuItems
        transition
        anchor={anchor}
        modal={false}
        className={clsx(defaultPanelClasses, menuItemsClassName)}
      >
        {items.map((entry) => {
          if (entry.type === "separator") {
            return (
              <MenuSeparator key={entry.id} className="h-px bg-gray-100" />
            );
          }

          const danger = entry.variant === "danger";
          const disabled = entry.disabled === true;

          // Headless `MenuItem` always closes the menu on activate; drill-in rows must
          // not use it — plain `role="menuitem"` buttons skip that behavior.
          if (entry.keepMenuOpen) {
            return (
              <button
                key={entry.id}
                type="button"
                role="menuitem"
                tabIndex={-1}
                disabled={disabled}
                onClick={() => {
                  if (!disabled) entry.onClick();
                }}
                className={clsx(
                  "flex w-full items-center gap-2 px-4 py-2 text-left text-sm outline-none",
                  disabled
                    ? "cursor-not-allowed text-gray-300"
                    : "cursor-pointer text-gray-700 hover:bg-gray-50 focus-visible:bg-gray-50",
                )}
              >
                {entry.icon != null && (
                  <span
                    className={clsx(
                      "shrink-0 [&_svg]:h-4 [&_svg]:w-4",
                      disabled ? "text-gray-300" : "text-gray-500",
                    )}
                  >
                    {entry.icon}
                  </span>
                )}
                {entry.label}
              </button>
            );
          }

          return (
            <MenuItem key={entry.id}>
              {({ focus, close }) => (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return;
                    entry.onClick();
                    close();
                  }}
                  className={clsx(
                    "flex w-full items-center gap-2 px-4 py-2 text-left text-sm",
                    disabled
                      ? "cursor-not-allowed text-gray-300"
                      : "cursor-pointer",
                    !disabled && (danger ? "text-red-600" : "text-gray-700"),
                    !disabled && focus && (danger ? "bg-red-50" : "bg-gray-50"),
                  )}
                >
                  {entry.icon != null && (
                    <span
                      className={clsx(
                        "shrink-0 [&_svg]:h-4 [&_svg]:w-4",
                        disabled
                          ? "text-gray-300"
                          : danger
                            ? "text-red-600"
                            : "text-gray-500",
                      )}
                    >
                      {entry.icon}
                    </span>
                  )}
                  {entry.label}
                </button>
              )}
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
}
