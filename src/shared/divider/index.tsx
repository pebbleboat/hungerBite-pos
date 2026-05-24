import clsx from "clsx";

const Divider = ({
  className,
  variant = "secondary",
}: {
  className?: string;
  variant?: "secondary" | "tertiary" | "primary" | "brand";
}) => {
  return (
    <div
      className={clsx(
        "h-[1px] w-full border-t",
        `border-${variant}`,
        className,
      )}
    />
  );
};

export default Divider;
