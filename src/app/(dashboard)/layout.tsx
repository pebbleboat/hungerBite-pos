"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { getOutletById } from "@/lib/apis";
import Loader from "@/shared/Loader";
import {
  getAccessToken,
  hasOutletInProfile,
  parseJwtPayload,
} from "@/utils/authSession";
import useSharedVariables from "@/utils/hooks/useSharedVariables";
import { queryKeys } from "@/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { FC, PropsWithChildren, useEffect, useState } from "react";

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  const accessToken = getAccessToken();
  const profile = accessToken ? parseJwtPayload(accessToken) : null;
  const { selectedOutletId: outletId } = useSharedVariables();

  const {
    data: outlet,
    isLoading: isOutletLoading,
    isError: isOutletError,
  } = useQuery({
    queryKey: queryKeys.outlets.detail(outletId),
    queryFn: () => getOutletById(outletId),
    enabled: Boolean(outletId),
  });

  useEffect(() => {
    setReady(false);

    if (!accessToken) {
      router.replace("/login");
      return;
    }

    if (profile && !hasOutletInProfile(profile)) {
      router.replace("/select-outlet");
      return;
    }

    if (!outletId) {
      router.replace("/select-outlet");
      return;
    }

    if (isOutletLoading) return;

    if (isOutletError || !outlet) {
      router.replace("/select-outlet");
      return;
    }

    if (outlet.status !== "open") {
      router.replace("/clock-in");
      return;
    }

    setReady(true);
  }, [
    accessToken,
    profile,
    outlet,
    outletId,
    isOutletLoading,
    isOutletError,
    router,
    pathname,
  ]);

  if (!ready) {
    return <Loader className="h-screen" size={28} variant="full-screen" />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#eef2f8]">
      <Header variant="dashboard" />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
