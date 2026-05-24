import clsx from "clsx";
import Text, { TextProps } from "./Text";

const PageHeader = ({
  titleProps,
  descriptionProps,
  className,
}: {
  titleProps: TextProps;
  descriptionProps: TextProps;
  className?: string;
}) => {
  return (
    <div className={clsx("space-y-1", className)}>
      <Text as="h2" size="2xl" type="semibold" {...titleProps} />
      <Text as="p" size="sm" variant="secondary" {...descriptionProps} />
    </div>
  );
};

export default PageHeader;
