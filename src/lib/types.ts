export type Order = {
  _id: string;
  item: string;
  quantity: number;
  status: string;
  outletId: string;
  customerName?: string;
  total?: number;
  items?: { name: string; quantity: number; modifiers?: string[] }[];
  createdAt?: string;
  updatedAt?: string;
  acceptedAt?: string;
  readyAt?: string;
  type?: "pickup" | "dine-in" | "delivery";
};

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

export type CreateOutletResponse = {
  _id?: string;
  id?: string;
  name?: string;
};

export type CatalogOutlet = {
  id: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  status?: string;
  isAcceptingOrders?: boolean;
};

export type OutletDetail = {
  id: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
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
