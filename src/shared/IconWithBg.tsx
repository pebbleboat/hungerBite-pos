import clsx from "clsx";
import { ReactNode } from "react";

const IconWithBg = ({
  icon,
  className,
  size = "sm",
}: {
  icon: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) => {
  return (
    <div className={className}>
      <div
        className={clsx(
          "flex justify-center items-center border border-white modalLogo absolute z-20 mt-2",
          {
            "h-14 w-14": size === "lg",
            "h-12 w-12": size === "md",
            "h-10 w-10": size === "sm",
          },
        )}
      >
        <div className="bg-white/40 absolute blur-[8px] rounded-[10px] h-full w-full" />
        {icon}
      </div>
      <div
        className={clsx(
          "!rounded-[10px] bg-primary rotate-[20deg] relative ml-2 z-10",
          {
            "h-14 w-14": size === "lg",
            "h-12 w-12": size === "md",
            "h-10 w-10": size === "sm",
          },
        )}
      />
    </div>
  );
};

export default IconWithBg;
