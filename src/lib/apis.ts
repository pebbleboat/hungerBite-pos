import type { LoginResponse, SignupResponse } from "@/utils/authSession";
import { MicroService } from "@/utils/enum";
import { API_PATHS, AUTH_PATHS } from "./apiConstant";
import axiosInstance from "./axiosInstance";
import {
  AddMenuItemPayload,
  AddMenuItemResponse,
  CatalogMenuItemRecord,
  CatalogOutlet,
  CreateOutletPayload,
  CreateOutletResponse,
  DeleteMenuItemResponse,
  UpdateOutletPayload,
  ForgotPasswordPayload,
  LoginPayload,
  OutletDetail,
  OutletOrdersApiResponse,
  ResetPasswordPayload,
  SignupPayload,
  UpdateMenuItemResponse,
} from "./types";

// ----------------------------------------------------------------------------------------------------------
// -------------------------------------------------- AUTH --------------------------------------------------
// ----------------------------------------------------------------------------------------------------------

export async function login(payload: LoginPayload) {
  const { data } = await axiosInstance(MicroService.AUTH).post<LoginResponse>(
    AUTH_PATHS.login,
    payload,
  );
  return data;
}

export async function signup(payload: SignupPayload) {
  const { data } = await axiosInstance(MicroService.AUTH).post<SignupResponse>(
    AUTH_PATHS.signup,
    payload,
  );
  return data;
}

export async function requestPasswordReset(payload: ForgotPasswordPayload) {
  const { data } = await axiosInstance(MicroService.AUTH).post<{
    message: string;
  }>(AUTH_PATHS.forgotPassword, payload);
  return data;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const { data } = await axiosInstance(MicroService.AUTH).post<{
    message: string;
  }>(AUTH_PATHS.resetPassword, payload);
  return data;
}

// ----------------------------------------------------------------------------------------------------------
// ------------------------------------------------- Outlet -------------------------------------------------
// ----------------------------------------------------------------------------------------------------------

export async function getOutletOrders(outletId: string) {
  const { data } = await axiosInstance(MicroService.POS).get<
    OutletOrdersApiResponse
  >(API_PATHS.outletOrders(outletId));
  return data;
}

export async function postOrderAction(
  outletId: string,
  orderId: string,
  action: "accept" | "reject",
) {
  await axiosInstance(MicroService.POS).post(
    API_PATHS.orderAction(outletId, orderId, action),
  );
}

export async function postOrderReady(outletId: string, orderId: string) {
  await axiosInstance(MicroService.POS).post(
    API_PATHS.orderReady(outletId, orderId),
  );
}

export async function postOrderCollect(outletId: string, orderId: string) {
  await axiosInstance(MicroService.POS).post(
    API_PATHS.orderCollect(outletId, orderId),
  );
}

export async function createOutlet(payload: CreateOutletPayload) {
  const { data } = await axiosInstance(MicroService.CATALOG).post<
    CreateOutletResponse
  >(API_PATHS.createOutlet, payload);
  return data;
}

export async function getOutlets() {
  const { data } = await axiosInstance(MicroService.CATALOG).get<
    CatalogOutlet[]
  >(API_PATHS.outlets);
  return data;
}

export async function getOutletById(outletId: string) {
  const { data } = await axiosInstance(MicroService.CATALOG).get<OutletDetail>(
    API_PATHS.outletById(outletId),
  );
  return data;
}

export async function updateOutlet(
  outletId: string,
  payload: UpdateOutletPayload,
) {
  const { data } = await axiosInstance(MicroService.CATALOG).patch<OutletDetail>(
    API_PATHS.outletById(outletId),
    payload,
  );
  return data;
}

export async function deleteOutlet(outletId: string) {
  const { data } = await axiosInstance(MicroService.CATALOG).delete<{
    message?: string;
  }>(API_PATHS.outletById(outletId));
  return data;
}

export async function startOutlet(outletId: string) {
  const { data } = await axiosInstance(MicroService.CATALOG).patch<OutletDetail>(
    API_PATHS.startOutlet(outletId),
  );
  return data;
}

export async function toggleOutlet(outletId: string) {
  const { data } = await axiosInstance(MicroService.CATALOG).patch<OutletDetail>(
    API_PATHS.toggleOutlet(outletId),
  );
  return data;
}

export async function endOutlet(outletId: string) {
  const { data } = await axiosInstance(MicroService.CATALOG).patch<OutletDetail>(
    API_PATHS.endOutlet(outletId),
  );
  return data;
}

export async function loginAsOutletOwner(outletId: string) {
  const { data } = await axiosInstance(MicroService.AUTH).post<LoginResponse>(
    AUTH_PATHS.loginAsOutlet(outletId),
  );
  return data;
}

// ----------------------------------------------------------------------------------------------------------
// -------------------------------------------------- Menu --------------------------------------------------
// ----------------------------------------------------------------------------------------------------------

export async function addMenuItem(outletId: string, payload: AddMenuItemPayload) {
  const { data } = await axiosInstance(MicroService.CATALOG).post<
    AddMenuItemResponse
  >(API_PATHS.addMenuItem(outletId), payload);
  return data;
}

export async function getMenuItems(outletId: string) {
  const { data } = await axiosInstance(MicroService.CATALOG).get<
    CatalogMenuItemRecord[]
  >(API_PATHS.menuItems(outletId));
  return data;
}

export async function getMenuItemById(outletId: string, itemId: string) {
  const { data } = await axiosInstance(MicroService.CATALOG).get<
    CatalogMenuItemRecord
  >(API_PATHS.menuItem(outletId, itemId));
  return data;
}

export async function updateMenuItem(
  outletId: string,
  itemId: string,
  payload: AddMenuItemPayload,
) {
  const { data } = await axiosInstance(MicroService.CATALOG).patch<
    UpdateMenuItemResponse
  >(API_PATHS.menuItem(outletId, itemId), payload);
  return data;
}

export async function deleteMenuItem(outletId: string, itemId: string) {
  const { data } = await axiosInstance(MicroService.CATALOG).delete<
    DeleteMenuItemResponse
  >(API_PATHS.menuItem(outletId, itemId));
  return data;
}
