import clsx from "clsx";
import { ComponentProps, FC, PropsWithChildren } from "react";

interface ICardWrapper extends ComponentProps<"div"> {
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const CardWrapper: FC<PropsWithChildren<ICardWrapper>> = ({
  children,
  className,
  onClick,
  style,
}) => {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-gray-100 bg-white p-4",
        onClick && "cursor-pointer",
        className,
      )}
      style={style}
      role={onClick ? "button" : undefined}
      onClick={onClick}
      onKeyDown={() => {}}
    >
      {children}
    </div>
  );
};

export default CardWrapper;
