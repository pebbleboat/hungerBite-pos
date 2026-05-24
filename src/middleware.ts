import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { storageKeys } from "@/utils/enum";
import { hasOutletInProfile, parseJwtPayload } from "@/utils/authSession";

const AUTH_PUBLIC_PATHS = ["/login", "/forgot-password"];
const ONBOARDING_PATH = "/onboarding";
const SELECT_OUTLET_PATH = "/select-outlet";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/signup" || pathname.startsWith("/signup/")) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  const accessToken = request.cookies.get(storageKeys.ACCESS_TOKEN)?.value;
  const onboardingTempToken = request.cookies.get(
    storageKeys.ONBOARDING_TEMP_TOKEN,
  )?.value;
  const tempToken = request.cookies.get(storageKeys.TEMP_TOKEN)?.value;

  const isAuthPublic = AUTH_PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isOnboarding =
    pathname === ONBOARDING_PATH || pathname.startsWith(`${ONBOARDING_PATH}/`);
  const isSelectOutlet =
    pathname === SELECT_OUTLET_PATH ||
    pathname.startsWith(`${SELECT_OUTLET_PATH}/`);

  // Onboarding step 2 — only onboarding_temp_token, no session yet.
  if (onboardingTempToken && !accessToken) {
    if (!isOnboarding) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    return NextResponse.next();
  }

  // Login flow — pick outlet before session is established.
  if (tempToken && !accessToken) {
    if (!isSelectOutlet) {
      return NextResponse.redirect(new URL("/select-outlet", request.url));
    }
    return NextResponse.next();
  }

  // Unauthenticated — login, forgot-password, or onboarding step 1 only.
  if (!accessToken) {
    if (!isAuthPublic && !isOnboarding) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  const profile = parseJwtPayload(accessToken);
  const hasOutlet = hasOutletInProfile(profile);

  if (!hasOutlet) {
    if (!isSelectOutlet) {
      return NextResponse.redirect(new URL("/select-outlet", request.url));
    }
    return NextResponse.next();
  }

  // Clock-in gating uses live outlet API `status` (open vs closed) on the client.
  if (isAuthPublic || isOnboarding || isSelectOutlet) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
