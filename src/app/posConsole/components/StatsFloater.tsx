"use client";

import Text from "@/shared/heading/Text";
import { FiClock, FiDollarSign } from "react-icons/fi";
import { formatCurrency } from "@/app/posConsole/utils/orderBoard";

type StatsFloaterProps = {
  liveRevenue: number;
  avgPrepTimeLabel: string;
};

export default function StatsFloater({
  liveRevenue,
  avgPrepTimeLabel,
}: StatsFloaterProps) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-10 flex gap-3">
      <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-brand-950 px-5 py-3 text-white shadow-[0_8px_24px_rgba(15,35,80,0.18)]">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
          <FiDollarSign className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <Text
            as="p"
            size="xxs"
            type="semibold"
            className="uppercase tracking-widest text-white/70"
          >
            Live Revenue
          </Text>
          <Text as="p" size="xl" type="bold" className="text-white">
            {formatCurrency(liveRevenue)}
          </Text>
        </div>
      </div>
      <div className="pointer-events-auto flex items-center gap-3 rounded-2xl bg-teal-700 px-5 py-3 text-white shadow-[0_8px_24px_rgba(15,35,80,0.18)]">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
          <FiClock className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <Text
            as="p"
            size="xxs"
            type="semibold"
            className="uppercase tracking-widest text-white/80"
          >
            Avg Prep Time
          </Text>
          <Text as="p" size="xl" type="bold" className="text-white">
            {avgPrepTimeLabel}
          </Text>
        </div>
      </div>
    </div>
  );
}
