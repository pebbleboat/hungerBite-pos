const CLOCKED_OUT_PREFIXES = ["/clock-in", "/manage-outlets"] as const;

/** Routes that use the clock-in header shell (no main nav). */
export function isClockedOutShellPath(pathname: string): boolean {
  return CLOCKED_OUT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export const MANAGE_OUTLETS_PATH = "/manage-outlets";

export function manageOutletEditPath(outletId: string): string {
  return `${MANAGE_OUTLETS_PATH}/edit/${encodeURIComponent(outletId)}`;
}
