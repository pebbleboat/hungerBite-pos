export const AUTH_ROLES = [
    { label: "Admin", value: "admin" },
    { label: "Staff", value: "staff" },
    { label: "Customer", value: "customer" },
] as const;

export type AuthRole = (typeof AUTH_ROLES)[number]["value"];

/** POS login always authenticates as staff (no role field on login form). */
export const POS_LOGIN_AUTH_ROLE: AuthRole = "staff";


