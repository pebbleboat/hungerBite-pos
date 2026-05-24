import clsx from "clsx";
import Divider from "@/shared/divider";

const DividerWithText = ({
  className,
  text,
}: {
  className?: string;
  text: string;
}) => {
  return (
    <div className={clsx("flex items-center", className)}>
      <Divider variant="secondary" />
      <div className="px-2 text-tertiary text-sm text-nowrap">{text}</div>
      <Divider variant="secondary" />
    </div>
  );
};

export default DividerWithText;
