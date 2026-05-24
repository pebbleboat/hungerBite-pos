import type { LoginResponse, SignupResponse } from "@/utils/authSession";
import { MicroService } from "@/utils/enum";
import { API_PATHS, AUTH_PATHS } from "./apiConstant";
import axiosInstance from "./axiosInstance";
import {
  AddMenuItemPayload,
  AddMenuItemResponse,
  CatalogOutlet,
  CreateOutletPayload,
  CreateOutletResponse,
  DeleteMenuItemResponse,
  ForgotPasswordPayload,
  LoginPayload,
  MenuItem,
  MenuItemStatus,
  Order,
  OutletDetail,
  ResetPasswordPayload,
  SignupPayload,
  UpdateMenuItemResponse,
} from "./types";

// ----------------------------------------------------------------------------------------------------------
// -------------------------------------------------- AUTH --------------------------------------------------
// ----------------------------------------------------------------------------------------------------------

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await axiosInstance(MicroService.AUTH).post(
    AUTH_PATHS.login,
    payload,
  );
  return data;
}

export async function signup(payload: SignupPayload): Promise<SignupResponse> {
  const { data } = await axiosInstance(MicroService.AUTH).post(
    AUTH_PATHS.signup,
    payload,
  );
  return data;
}

export async function requestPasswordReset(
  payload: ForgotPasswordPayload,
): Promise<{ message: string }> {
  const { data } = await axiosInstance(MicroService.AUTH).post(
    AUTH_PATHS.forgotPassword,
    payload,
  );
  return data;
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<{ message: string }> {
  const { data } = await axiosInstance(MicroService.AUTH).post(
    AUTH_PATHS.resetPassword,
    payload,
  );
  return data;
}

// ----------------------------------------------------------------------------------------------------------
// ------------------------------------------------- Outlet -------------------------------------------------
// ----------------------------------------------------------------------------------------------------------

export async function getOutletOrders(outletId: string): Promise<Order[]> {
  const { data } = await axiosInstance(MicroService.POS).get<Order[]>(
    API_PATHS.outletOrders(outletId),
  );
  return Array.isArray(data) ? data : [];
}

export async function postOrderAction(
  outletId: string,
  orderId: string,
  action: "accept" | "reject",
): Promise<void> {
  await axiosInstance(MicroService.POS).post(
    API_PATHS.orderAction(outletId, orderId, action),
  );
}

export async function createOutlet(
  payload: CreateOutletPayload,
): Promise<CreateOutletResponse> {
  const { data } = await axiosInstance(MicroService.CATALOG).post(
    API_PATHS.createOutlet,
    payload,
  );
  return data;
}

type CatalogOutletRecord = CatalogOutlet & { _id?: string };

function mapCatalogOutlet(raw: CatalogOutletRecord): CatalogOutlet {
  return {
    id: String(raw.id ?? raw._id ?? ""),
    name: raw.name,
    address: raw.address,
    city: raw.city,
    phone: raw.phone,
    status: raw.status,
    isAcceptingOrders: Boolean(raw.isAcceptingOrders),
  };
}

export async function getOutlets(): Promise<CatalogOutlet[]> {
  const { data } = await axiosInstance(MicroService.CATALOG).get<
    CatalogOutletRecord[]
  >(API_PATHS.outlets);
  if (!Array.isArray(data)) return [];
  return data.map(mapCatalogOutlet).filter((outlet) => Boolean(outlet.id));
}

type OutletDetailRecord = OutletDetail & { _id?: string };

function mapOutletDetail(
  data: OutletDetailRecord,
  outletId: string,
): OutletDetail {
  return {
    id: String(data.id ?? data._id ?? outletId),
    name: data.name,
    address: data.address,
    city: data.city,
    phone: data.phone,
    status: data.status,
    isAcceptingOrders: Boolean(data.isAcceptingOrders),
  };
}

export async function getOutletById(outletId: string): Promise<OutletDetail> {
  const { data } = await axiosInstance(MicroService.CATALOG).get<
    OutletDetailRecord
  >(API_PATHS.outletById(outletId));
  return mapOutletDetail(data, outletId);
}

export async function startOutlet(outletId: string): Promise<OutletDetail> {
  const { data } = await axiosInstance(MicroService.CATALOG).patch<
    OutletDetailRecord
  >(API_PATHS.startOutlet(outletId));
  return mapOutletDetail(data, outletId);
}

export async function toggleOutlet(outletId: string): Promise<OutletDetail> {
  const { data } = await axiosInstance(MicroService.CATALOG).patch<
    OutletDetailRecord
  >(API_PATHS.toggleOutlet(outletId));
  return mapOutletDetail(data, outletId);
}

export async function endOutlet(outletId: string): Promise<OutletDetail> {
  const { data } = await axiosInstance(MicroService.CATALOG).patch<
    OutletDetailRecord
  >(API_PATHS.endOutlet(outletId));
  return mapOutletDetail(data, outletId);
}

export async function loginAsOutletOwner(
  outletId: string,
): Promise<LoginResponse> {
  const { data } = await axiosInstance(MicroService.AUTH).post(
    AUTH_PATHS.loginAsOutlet(outletId),
  );
  return data;
}

// ----------------------------------------------------------------------------------------------------------
// -------------------------------------------------- Menu --------------------------------------------------
// ----------------------------------------------------------------------------------------------------------

export async function addMenuItem(
  outletId: string,
  payload: AddMenuItemPayload,
): Promise<AddMenuItemResponse> {
  const { data } = await axiosInstance(MicroService.CATALOG).post<
    AddMenuItemResponse
  >(API_PATHS.addMenuItem(outletId), payload);
  return data;
}

type CatalogMenuItemRecord = {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  price?: number;
  status?: string;
  category?: string;
  image?: string;
  dietary?: string;
};

function normalizeMenuStatus(status?: string): MenuItemStatus {
  const value = (status ?? "").toLowerCase().replace(/\s+/g, "_");
  if (value === "unavailable") return "unavailable";
  if (value === "out_of_stock") return "out_of_stock";
  return "available";
}

function mapCatalogMenuItem(raw: CatalogMenuItemRecord): MenuItem {
  const id = String(raw.id ?? raw._id ?? "");
  const category = raw.category ?? "default";
  return {
    id,
    name: raw.name,
    sku: id ? id.slice(-6).toUpperCase() : "—",
    description: raw.description ?? "",
    price: Number(raw.price) || 0,
    imageUrl: raw.image,
    category,
    dietary: raw.dietary,
    status: normalizeMenuStatus(raw.status),
  };
}

export async function getMenuItems(outletId: string): Promise<MenuItem[]> {
  const { data } = await axiosInstance(MicroService.CATALOG).get<
    CatalogMenuItemRecord[]
  >(API_PATHS.menuItems(outletId));
  if (!Array.isArray(data)) return [];
  return data.map(mapCatalogMenuItem).filter((item) => Boolean(item.id));
}

export async function getMenuItemById(
  outletId: string,
  itemId: string,
): Promise<MenuItem> {
  const { data } = await axiosInstance(MicroService.CATALOG).get<
    CatalogMenuItemRecord
  >(API_PATHS.menuItem(outletId, itemId));
  const item = mapCatalogMenuItem(data);
  if (!item.id) {
    throw new Error("Menu item not found");
  }
  return item;
}

export async function updateMenuItem(
  outletId: string,
  itemId: string,
  payload: AddMenuItemPayload,
): Promise<UpdateMenuItemResponse> {
  const { data } = await axiosInstance(MicroService.CATALOG).patch<
    UpdateMenuItemResponse
  >(API_PATHS.menuItem(outletId, itemId), payload);
  return data;
}

export async function deleteMenuItem(
  outletId: string,
  itemId: string,
): Promise<DeleteMenuItemResponse> {
  const { data } = await axiosInstance(MicroService.CATALOG).delete<
    DeleteMenuItemResponse
  >(API_PATHS.menuItem(outletId, itemId));
  return data;
}
