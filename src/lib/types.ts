export type OrderItemLine = {
  id: string;
  quantity: number;
  name: string;
  description?: string;
  price: number;
  status?: string;
  dietary?: string;
  category?: string;
  outletId?: string;
};

export type Order = {
  id: string;
  status: string;
  outletId: string;
  customerName?: string;
  total?: number;
  items: OrderItemLine[];
  createdAt?: string;
  updatedAt?: string;
  acceptedAt?: string;
  readyAt?: string;
  type?: "pickup" | "dine-in" | "delivery";
};

/** Raw order object from outlet orders API */
export type OutletOrderRecord = {
  id: string;
  status: string;
  outletId: string;
  items: OrderItemLine[];
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
  acceptedAt?: string;
  readyAt?: string;
  type?: Order["type"];
};

/** GET /outlet/:outletId/orders response */
export type OutletOrdersApiResponse = {
  pending: OutletOrderRecord[];
  preparing: OutletOrderRecord[];
  ready: OutletOrderRecord[];
  history?: OutletOrderRecord[];
};

export type OutletOrderBoardColumnId =
  | "pending"
  | "preparing"
  | "ready"
  | "history";

/** Orders grouped for POS kanban columns */
export type OutletOrdersBoard = Record<
  OutletOrderBoardColumnId,
  Order[]
>;

export type LoginPayload = {
  email: string;
  password: string;
  role: string;
};

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  role: string;
  outletId?: number;
};

export type ForgotPasswordPayload = {
  email: string;
  role: string;
};

export type ResetPasswordPayload = {
  email: string;
  password: string;
  role: string;
};

export type CreateOutletPayload = {
  name: string;
  address: string;
  city: string;
  phone: string;
};

/** PATCH /outlet/:outletId body */
export type UpdateOutletPayload = {
  name: string;
  address: string;
  city: string;
  phone: string;
};

export type CreateOutletResponse = {
  id: string;
  name?: string;
};

export type CatalogMenuItemRecord = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  status?: string;
  category?: string;
  image?: string;
  dietary?: string;
};

export type CatalogOutlet = {
  id: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  image?: string;
  status?: string;
  isAcceptingOrders?: boolean;
};

export type OutletDetail = {
  id: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  image?: string;
  status?: string;
  isAcceptingOrders?: boolean;
};

export type AddMenuItemPayload = {
  name: string;
  description: string;
  status: string;
  price: number;
  dietary: string;
  category: string;
  image?: string;
};

export type AddMenuItemResponse = {
  message: string;
  id: string;
};

export type UpdateMenuItemResponse = AddMenuItemResponse;

export type DeleteMenuItemResponse = AddMenuItemResponse;

export type MenuItemStatus = "available" | "unavailable" | "out_of_stock";

export type MenuItem = {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  dietary?: string;
  status: MenuItemStatus;
};
