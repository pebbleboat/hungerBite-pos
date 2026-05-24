export type HeaderVariant = "dashboard" | "clock-in";

export type NavItem = {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
  disabled?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Orders",
    match: (p) => p === "/",
  },
  {
    href: "/menu",
    label: "Menu Management",
    match: (p) => p === "/menu" || p.startsWith("/menu/"),
  },
];

export type NavOverlay = "menu" | "stopOrders" | "startOrders" | "endDay" | "logout";
