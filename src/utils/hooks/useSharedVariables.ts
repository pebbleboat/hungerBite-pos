import { getAccessToken, parseJwtPayload } from "@/utils/authSession";
import { storageKeys } from "../enum";
import { getLocalItem, setLocalItem } from "../localstorage";

export default function useSharedVariables() {
  const deviceId =
    getLocalItem<string>(storageKeys.REGISTERED_DEVICE_ID) || "";

  let selectedOutletId =
    getLocalItem<string>(storageKeys.SELECTED_OUTLET_ID) || "";

  if (!selectedOutletId) {
    const token = getAccessToken();
    const profile = token ? parseJwtPayload(token) : null;
    if (profile?.outletId != null) {
      selectedOutletId = String(profile.outletId);
      setLocalItem(storageKeys.SELECTED_OUTLET_ID, selectedOutletId);
    }
  }

  return {
    deviceId,
    selectedOutletId,
  };
}
