import clsx from "clsx";
import Link from "next/link";
import { Fragment, ReactNode } from "react";
import Text, { TextProps } from "./Text";

const TextWithLinks = ({
  links,
  text,
  className,
  textProps,
}: {
  links: {
    label?: string;
    link?: string;
    body?: ReactNode;
    target?: string;
    className?: string;
  }[];
  textProps?: TextProps;
  text: string;
  className?: string;
}) => {
  return (
    <div className={clsx("flex flex-wrap justify-center", className)}>
      <Text
        type={textProps?.type || "medium"}
        className={clsx(textProps?.className)}
        {...textProps}
      >
        {text}
      </Text>
      &nbsp;
      {links?.map((item, idx) => (
        <Fragment key={item?.link}>
          {item?.body ? (
            item?.body
          ) : (
            <Link
              target={item?.target}
              href={item?.link || "#"}
              className={clsx(`font-bold text-black`, item?.className)}
            >
              {item?.label}
            </Link>
          )}
          {idx === links.length - 2 && <span className="px-1">&</span>}
        </Fragment>
      ))}
    </div>
  );
};

export default TextWithLinks;
