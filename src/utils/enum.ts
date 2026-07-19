export enum MicroService {
  AUTH = "auth",
  POS = "pos",
  ORDER = "order",
  CATALOG = "catalog",
  AGENT = "agent",
}

export const storageKeys = {
  SELECTED_OUTLET_ID: "selected_outlet_id",
  DEVICE_ID: "device_id",
  REGISTERED_DEVICE_ID: "registered_device_id",
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  CURRENT_USER: "current_user",
  ONBOARDING_TEMP_TOKEN: "onboarding_temp_token",
  TEMP_TOKEN: "temp_token",
} as const;
