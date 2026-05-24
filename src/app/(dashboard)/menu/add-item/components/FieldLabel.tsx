"use client";

import Text from "@/shared/heading/Text";
import clsx from "clsx";
import type { ReactNode } from "react";

type FieldLabelProps = {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
};

export default function FieldLabel({
  htmlFor,
  children,
  required,
  className,
}: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className={clsx("inline-block", className)}>
      <Text
        as="span"
        size="xxs"
        type="semibold"
        variant="secondary"
        className="uppercase tracking-[0.08em]"
      >
        {children}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </Text>
    </label>
  );
}
