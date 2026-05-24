import clsx from "clsx";
import Img from "./Img";
import { ReactNode } from "react";
export enum ChipVariant {
  Gray = "gray",
  Brand = "brand",
  Error = "error",
  Warning = "warning",
  Success = "success",
  Blue = "blue",
  Purple = "purple",
  Pink = "pink",
  Orange = "orange",
}
export interface IChip {
  title: ReactNode;
  image?: string | ReactNode;
  styleImage?: string;
  variant?:
    | "gray"
    | "brand"
    | "error"
    | "warning"
    | "success"
    | "blue"
    | "purple"
    | "pink"
    | "orange";
  type?: "tag" | "image" | "primary";
  size?: "xs" | "sm" | "md" | "lg";
  outlined?: boolean;
  className?: string;
  onClick?: () => void;
}
const Chip = ({
  title,
  image,
  variant = "brand",
  type,
  size = "md",
  outlined,
  className,
  onClick,
  styleImage,
}: IChip) => {
  return (
    <div
      onClick={onClick}
      onKeyDown={() => {}}
      role="button"
      className={clsx(
        onClick && "cursor-pointer",
        "border text-nowrap w-max h-max gap-x-[6px] flex items-center capitalize rounded-full font-medium",
        outlined
          ? "border-primary bg-primary text-gray-700 shadow-xs"
          : {
              "border-gray-200 bg-gray-50 text-gray-700": variant === "gray",
              "border-brand-200 bg-brand-50 text-brand-700":
                variant === "brand",
              "border-red-200 bg-red-50 text-red-700": variant === "error",
              "border-yellow-200 bg-yellow-50 text-yellow-700":
                variant === "warning",
              "border-green-200 bg-green-50 text-green-700":
                variant === "success",
              "border-blue-200 bg-blue-50 text-blue-700": variant === "blue",
              "border-purple-200 bg-purple-50 text-purple-700":
                variant === "purple",
              "border-pink-200 bg-pink-50 text-pink-700": variant === "pink",
              "border-orange-200 bg-orange-50 text-orange-700":
                variant === "orange",
            },
        { "text-xs": size === "xs" },
        { "text-sm": size === "sm" || size === "md" },
        { "text-base": size === "lg" },
        image
          ? {
              "px-1 py-[2px]": size === "sm" || size === "xs",
              "px-[6px] py-[2px]": size === "md",
              "px-2 py-1": size === "lg",
            }
          : {
              "px-[6px] py-[2px]": size === "sm" || size === "xs",
              "px-2 py-[2px]": size === "md",
              "px-[10px] py-1": size === "lg",
            },
        className,
      )}
    >
      {type === "tag" && (
        <div
          className={clsx("h-[7px] w-[7px] rounded-full", {
            "bg-gray-500": variant === "gray",
            "bg-primary": variant === "brand",
            "bg-red-500": variant === "error",
            "bg-yellow-500": variant === "warning",
            "bg-green-500": variant === "success",
            "bg-blue-500": variant === "blue",
            "bg-purple-500": variant === "purple",
            "bg-pink-500": variant === "pink",
            "bg-orange-500": variant === "orange",
          })}
        />
      )}
      {typeof image === "string" ? (
        <Img
          src={image}
          height={24}
          width={24}
          alt=""
          className={clsx("rounded-full h-4 w-4", styleImage)}
          isLocal
        />
      ) : (
        image
      )}
      {title}
    </div>
  );
};

export default Chip;
