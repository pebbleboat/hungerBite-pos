"use client";

import Text from "@/shared/heading/Text";
import { FC } from "react";

type OnboardingProgressProps = {
  step: 1 | 2;
  total?: number;
};

const OnboardingProgress: FC<OnboardingProgressProps> = ({
  step,
  total = 2,
}) => {
  const percent = Math.round((step / total) * 100);

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <Text
          as="span"
          size="xxs"
          type="semibold"
          className="uppercase tracking-[0.12em] text-gray-500"
        >
          Step {step} of {total}
        </Text>
        <Text
          as="span"
          size="xxs"
          type="semibold"
          className="uppercase tracking-[0.12em] text-gray-500"
        >
          {percent}%
        </Text>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-brand-950 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default OnboardingProgress;
