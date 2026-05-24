import clsx from "clsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Loader({
  variant = "default",
  className,
  type,
  wrapperClass,
  height,
  size = 18,
}: {
  variant?: "default" | "full-screen";
  className?: string;
  wrapperClass?: string;
  height?: number;
  type?: "bounce";
  size?: number;
}) {
  return type === "bounce" ? (
    <div
      className={clsx(
        "flex items-center justify-center space-x-2",
        wrapperClass,
      )}
    >
      <span className="onl sr-only">Loading...</span>
      <div className="h-3 w-3 animate-bounce rounded-full bg-brand-solid [animation-delay:-0.3s]" />
      <div className="h-3 w-3 animate-bounce rounded-full bg-brand-solid [animation-delay:-0.15s]" />
      <div className="h-3 w-3 animate-bounce rounded-full bg-brand-solid" />
    </div>
  ) : (
    <div
      className={clsx(
        {
          "flex h-full w-full items-center justify-center":
            variant === "full-screen",
        },
        wrapperClass,
      )}
      style={{ height: height ? `calc(100vh - ${height}px)` : "" }}
    >
      <AiOutlineLoading3Quarters
        size={size}
        className={clsx("mx-auto animate-spin", className)}
      />
    </div>
  );
}
