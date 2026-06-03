"use client";

import Text from "@/shared/heading/Text";
import clsx from "clsx";
import type { ReactNode } from "react";
import Button from "../buttons/Button";

export type MenuPopoverItem = {
  id: string;
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: "default" | "danger";
  disabled?: boolean;
};

export type MenuPopoverHeader = {
  title: string;
  subtitle?: string;
};

export interface MenuPopoverProps {
  children: ReactNode;
  items: MenuPopoverItem[];
  header?: MenuPopoverHeader;
  open: boolean;
  onClose: () => void;
  className?: string;
  panelClassName?: string;
}

export default function MenuPopover({
  children,
  items,
  header,
  open,
  onClose,
  className,
  panelClassName,
}: MenuPopoverProps) {
  return (
    <div className={clsx("relative", className)}>
      {children}

      {open ? (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-10 cursor-default"
            onClick={onClose}
          />
          <div
            className={clsx(
              "absolute right-0 top-11 z-20 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-lg",
              panelClassName,
            )}
          >
            {header ? (
              <div className="border-b border-gray-100 px-3 py-2">
                <Text
                  as="p"
                  size="sm"
                  type="semibold"
                  className="text-gray-900"
                >
                  {header.title}
                </Text>
                {header.subtitle ? (
                  <Text
                    as="p"
                    size="xxs"
                    variant="secondary"
                    className="mt-0.5"
                  >
                    {header.subtitle}
                  </Text>
                ) : null}
              </div>
            ) : null}

            {items.map((entry, index) => {
              const danger = entry.variant === "danger";
              return (
                <Button
                  variant="tertiary"
                  btnName={entry.label}
                  icon={entry.icon}
                  size="xs"
                  fullWidth
                  disabled={entry.disabled}
                  onClick={() => {
                    if (entry.disabled) return;
                    entry.onClick();
                  }}
                  className={clsx(
                    "justify-start !font-normal",
                    index === 0 && "mt-1",
                    danger && "text-red-600 hover:bg-red-50",
                  )}
                />
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
