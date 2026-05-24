"use client";

import Text from "@/shared/heading/Text";
import clsx from "clsx";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";

type SectionCardProps = {
  title: string;
  icon: IconType;
  children: ReactNode;
  className?: string;
  iconClassName?: string;
};

export default function SectionCard({
  title,
  icon: Icon,
  children,
  className,
  iconClassName,
}: SectionCardProps) {
  return (
    <section
      className={clsx(
        "rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,35,80,0.04)]",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <span
          className={clsx(
            "flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-700",
            iconClassName,
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <Text as="h2" size="base" type="bold" className="text-gray-900">
          {title}
        </Text>
      </div>
      {children}
    </section>
  );
}
