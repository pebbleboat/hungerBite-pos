import clsx from "clsx";
import React, { ReactNode } from "react";
import Loader from "../Loader";

export interface IButton {
  variant?:
    | "primary"
    | "secondary"
    | "secondary-color"
    | "tertiary"
    | "tertiary-color"
    | "tertiary-link"
    | "tertiary-color-link"
    | "error";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  fullWidth?: boolean;
  isLoading?: boolean;
  btnName?: string;
  className?: string;
  onClick?: (
    e?: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>,
  ) => void;
  icon?: ReactNode;
  secondaryIcon?: ReactNode;
  children?: ReactNode;
  type?: "button" | "submit";
  form?: string;
  styleBtnName?: string;
}

const Button = ({
  variant = "primary",
  size = "md",
  icon,
  btnName,
  onClick,
  disabled,
  fullWidth,
  className,
  secondaryIcon,
  isLoading,
  type = "button",
  form,
  styleBtnName,
  children,
}: IButton) => {
  const variantClasses = {
    primary: disabled
      ? "bg-gray-100 text-gray-400 !cursor-not-allowed border border-gray-200"
      : "bg-brand-600 hover:bg-brand-700 text-white",
    secondary: disabled
      ? "bg-white text-gray-400 !cursor-not-allowed border border-gray-200"
      : "text-gray-700 border bg-white hover:bg-gray-50 border-gray-300",
    "secondary-color": disabled
      ? "bg-white text-gray-400 !cursor-not-allowed border border-gray-200"
      : "text-brand-700 border border-brand-400 bg-white hover:bg-brand-50",
    tertiary: disabled
      ? "text-gray-400 !cursor-not-allowed"
      : "text-gray-600 hover:bg-gray-50",
    "tertiary-color": disabled
      ? "text-gray-400 !cursor-not-allowed"
      : "text-brand-700 hover:bg-brand-50",
    "tertiary-link": disabled
      ? "text-gray-400 !cursor-not-allowed"
      : "text-gray-600",
    "tertiary-color-link": disabled
      ? "text-gray-400 !cursor-not-allowed"
      : "text-brand-700 !p-0",
    error: disabled
      ? "bg-gray-100 text-gray-400 !cursor-not-allowed border border-gray-200"
      : "bg-red-600 hover:bg-red-700 text-white",
  };

  const sizeClasses = {
    xs: "py-2 px-3 text-sm leading-[21px] gap-x-1",
    sm: "py-[10px] px-[14px] text-sm leading-[21px] gap-x-1",
    md: "py-[10px] px-4 gap-x-[6px]",
    lg: "py-3 px-[18px] gap-x-[6px]",
    xl: "py-4 px-[22px] text-lg gap-x-[10px] !text-2xl",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!disabled && !isLoading && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={clsx(
        "w-max h-max flex items-center prevent-select justify-center rounded-lg cursor-pointer transition-colors duration-300 font-semibold relative",
        variantClasses[variant],
        sizeClasses[size],
        {
          "!w-full justify-center": fullWidth,
          "[&>*]:opacity-0": isLoading,
        },
        className,
      )}
      {...(form ? { form } : {})}
      type={type}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      {isLoading && <Loader wrapperClass="!opacity-100 absolute" />}
      {icon}
      {btnName && (
        <div className={clsx("text-nowrap", styleBtnName)}>{btnName}</div>
      )}
      {secondaryIcon}
      {children}
    </button>
  );
};

export default Button;
