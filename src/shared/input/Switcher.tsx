"use client";

import clsx from "clsx";
import type { FC, ReactNode } from "react";
import { useId } from "react";

export interface ISwitcher {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
  wrapperClassName?: string;
  /** `xs` = compact (e.g. table action rows next to icon buttons); `sm` / `md` = larger. */
  size?: "xs" | "sm" | "md";
  id?: string;
  name?: string;
  labelSrOnly?: boolean;
}

const trackSizes = {
  /** ~16px tall — aligns with `Button` `xs` icon buttons */
  xs: "h-4 min-w-[1.75rem] p-[2px]",
  sm: "h-5 min-w-[2.25rem] p-[3px]",
  md: "h-6 min-w-[2.75rem] p-[3px]",
};

const thumbSizes = {
  xs: "h-3 w-3 min-h-3 min-w-3",
  sm: "h-3.5 w-3.5 min-h-3.5 min-w-3.5",
  md: "h-5 w-5 min-h-5 min-w-5",
};

const Switcher: FC<ISwitcher> = ({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  className,
  wrapperClassName,
  size = "md",
  id,
  name,
  labelSrOnly = false,
}) => {
  const uid = useId();
  const switchId = id ?? `switch-${uid}`;
  const labelId = `${switchId}-label`;

  const toggle = () => {
    if (!disabled) onChange(!checked);
  };

  return (
    <div
      className={clsx(
        "flex gap-3",
        label || description ? "items-start" : "items-center",
        wrapperClassName,
      )}
    >
      <button
        type="button"
        id={switchId}
        name={name}
        role="switch"
        aria-checked={checked}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={description ? `${switchId}-description` : undefined}
        disabled={disabled}
        onClick={toggle}
        className={clsx(
          "relative inline-flex shrink-0 rounded-full transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          size === "xs"
            ? "focus-visible:ring-offset-1"
            : "focus-visible:ring-offset-2",
          trackSizes[size],
          checked ? "bg-brand-600" : "bg-gray-200",
          disabled && "cursor-not-allowed opacity-50",
          !disabled && "cursor-pointer",
          className,
        )}
      >
        <span
          className={clsx(
            "block rounded-full bg-white shadow-sm ring-0 transition-[margin] duration-200 ease-out",
            thumbSizes[size],
            checked ? "ml-auto" : "",
          )}
          aria-hidden
        />
      </button>

      {(label || description) && (
        <div className="min-w-0 flex-1 pt-0.5">
          {label && (
            <label
              id={labelId}
              htmlFor={switchId}
              className={clsx(
                "text-sm font-medium text-gray-900",
                labelSrOnly && "sr-only",
                !disabled && "cursor-pointer",
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={`${switchId}-description`}
              className={clsx("text-xs text-gray-500", label && "mt-0.5")}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Switcher;
