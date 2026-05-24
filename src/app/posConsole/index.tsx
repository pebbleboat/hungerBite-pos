"use client";

import OrderColumn from "@/app/posConsole/components/OrderColumn";
import StatsFloater from "@/app/posConsole/components/StatsFloater";
import { BOARD_COLUMNS } from "@/app/posConsole/utils/orderBoard";
import Loader from "@/shared/Loader";
import Text from "@/shared/heading/Text";
import { useHook } from "./useHook";

export function PosConsole() {
  const {
    activeColumn,
    setActiveColumn,
    grouped,
    liveRevenue,
    avgPrepTimeLabel,
    loadError,
    handleAccept,
    handleReject,
    handleMarkReady,
    handleMarkDelivered,
    isOrdersLoading,
    isActionPending,
  } = useHook();

  return (
    <>
      {loadError ? (
        <Text size="sm" className="px-6 py-3 text-red-600">
          {loadError}
        </Text>
      ) : null}

      {isOrdersLoading &&
      grouped.pending.length === 0 &&
      grouped.preparing.length === 0 ? (
        <Loader className="py-20" size={28} />
      ) : (
        <div className="flex min-h-0 gap-5 overflow-x-auto px-4 py-5 lg:px-6">
          {BOARD_COLUMNS.map((col) => (
            <OrderColumn
              key={col.id}
              columnId={col.id}
              label={col.label}
              icon={col.icon}
              orders={grouped[col.id]}
              isActive={activeColumn === col.id}
              onActivate={setActiveColumn}
              onAccept={handleAccept}
              onReject={handleReject}
              onMarkReady={handleMarkReady}
              onMarkDelivered={handleMarkDelivered}
              isActionPending={isActionPending}
            />
          ))}
        </div>
      )}

      <StatsFloater
        liveRevenue={liveRevenue}
        avgPrepTimeLabel={avgPrepTimeLabel}
      />
    </>
  );
}
