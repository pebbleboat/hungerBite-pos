import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";

export interface TextProps extends ComponentProps<"p"> {
  children?: ReactNode;
  className?: string;
  as?: React.ElementType;
  size?: "5xl" | "4xl" | "3xl" | "2xl" | "xl" | "lg" | "base" | "sm" | "xs" | "xxs";
  type?: "normal" | "medium" | "semibold" | "bold";
  variant?: string;
}

const sizeClasses = {
  "5xl": "text-5xl",
  "4xl": "text-4xl",
  "3xl": "text-3xl",
  "2xl": "text-2xl",
  xl: "text-xl",
  lg: "text-lg",
  base: "text-base",
  sm: "text-sm",
  xs: "text-xs",
  xxs: "text-[10px]",
};

const typeClasses = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const variantClasses: Record<string, string> = {
  primary: "text-black",
  brand: "text-brand-600",
  secondary: "text-gray-600",
  tertiary: "text-gray-500",
  quaternary: "text-gray-400",
  white: "text-white",
};

const Text = ({
  children,
  className,
  as: Component = "div",
  size = "base",
  variant = "primary",
  type = "normal",
  ...props
}: TextProps) => {
  return (
    <Component
      className={clsx(
        sizeClasses[size],
        typeClasses[type],
        variantClasses[variant] ?? variant,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Text;
