import clsx from "clsx";
import { InputHTMLAttributes, ReactNode } from "react";
import { FiAlertCircle } from "react-icons/fi";
export interface IInputField extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  wrapperClass?: string;
  icon?: ReactNode;
  errorMessage?: string;
  secondaryIcon?: ReactNode;
  required?: boolean;
}
const InputField = ({
  label,
  className,
  wrapperClass,
  errorMessage,
  icon,
  secondaryIcon,
  required = false,
  type,
  ...rest
}: IInputField) => {
  const isDate = type === "date";
  return (
    <div className={clsx("flex flex-col gap-y-1", wrapperClass)}>
      {label && (
        <label className="text-sm">
          {label}
          {required && <span className="text-red-500">&nbsp;*</span>}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-3 top-[14px]">{icon}</div>}
        <input
          type={type}
          className={clsx(
            "h-11 rounded-lg border px-3 text-sm outline-none w-full",
            icon && "pl-9",
            secondaryIcon && "pr-9",
            isDate && "[color-scheme:light]",
            /* With error: hide native calendar icon so it doesn’t clash with validation icon */
            isDate &&
              errorMessage &&
              "[&::-webkit-calendar-picker-indicator]:hidden [&::-moz-calendar-picker-indicator]:hidden",
            errorMessage && !secondaryIcon && "pr-10",
            errorMessage ? "border-red-500" : "border-gray-100",
            className,
          )}
          {...rest}
        />
        {secondaryIcon && (
          <div className="absolute right-3 top-[14px]">{secondaryIcon}</div>
        )}
        {errorMessage && (
          <FiAlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-1" />
        )}
      </div>
      {errorMessage && (
        <div className="text-xs text-red-600">{errorMessage}</div>
      )}
    </div>
  );
};

export default InputField;
