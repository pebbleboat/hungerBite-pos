import { setCookie, removeCookie, getCookie } from "@/utils/cookies";
import { storageKeys } from "@/utils/enum";
import { getLocalItem, setLocalItem, removeLocalItem, clearLocalStorage } from "@/utils/localstorage";

export type AuthUser = {
  userId?: string;
  email?: string;
  name?: string;
  role?: string;
  outletId?: number | string;
};

export type LoginResponse = {
  message: string;
  accessToken: string;
  role: string;
  requiresOnboarding?: boolean;
  isNewUser?: boolean;
};

export type SignupResponse = {
  message: string;
  accessToken: string;
  userId?: string;
  role?: string;
};

export function parseJwtPayload(token: string): AuthUser | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as AuthUser;
  } catch {
    return null;
  }
}

export function hasOutletInProfile(profile: AuthUser | null): boolean {
  const outletId = profile?.outletId;
  return outletId !== undefined && outletId !== null && outletId !== "";
}

function readToken(key: string): string | null {
  const fromStorage = getLocalItem<string>(key);
  if (fromStorage) return fromStorage;
  const fromCookie = getCookie(key);
  return typeof fromCookie === "string" ? fromCookie : null;
}

function writeToken(key: string, token: string, cookieDays: number): void {
  setLocalItem(key, token);
  setCookie(key, token, cookieDays);
}

function removeToken(key: string): void {
  removeLocalItem(key);
  removeCookie(key);
}

export function getAccessToken(): string | null {
  return readToken(storageKeys.ACCESS_TOKEN);
}

export function getOnboardingTempToken(): string | null {
  return readToken(storageKeys.ONBOARDING_TEMP_TOKEN);
}

export function getTempToken(): string | null {
  return readToken(storageKeys.TEMP_TOKEN);
}

/** Bearer token for API calls: session → onboarding step 2 → login outlet pick. */
export function getBearerToken(): string | null {
  return getAccessToken() ?? getOnboardingTempToken() ?? getTempToken();
}

export function setOnboardingTempToken(token: string): void {
  writeToken(storageKeys.ONBOARDING_TEMP_TOKEN, token, 1);
}

export function clearOnboardingTempToken(): void {
  removeToken(storageKeys.ONBOARDING_TEMP_TOKEN);
}

export function setTempToken(token: string): void {
  writeToken(storageKeys.TEMP_TOKEN, token, 1);
}

export function clearTempToken(): void {
  removeToken(storageKeys.TEMP_TOKEN);
}

export function persistAuthSession(accessToken: string): AuthUser | null {
  const profile = parseJwtPayload(accessToken);
  writeToken(storageKeys.ACCESS_TOKEN, accessToken, 7);
  if (profile) {
    setLocalItem(storageKeys.CURRENT_USER, profile);
  }
  return profile;
}

export function clearAuthSession(): void {
  removeToken(storageKeys.ACCESS_TOKEN);
  clearOnboardingTempToken();
  clearTempToken();
  clearLocalStorage()
}

export function getSessionProfile(): AuthUser | null {
  const token = getBearerToken();
  if (token) {
    return parseJwtPayload(token) ?? getLocalItem<AuthUser>(storageKeys.CURRENT_USER);
  }
  return getLocalItem<AuthUser>(storageKeys.CURRENT_USER);
}
