import type { CatalogOutlet, OutletDetail, UpdateOutletPayload } from "@/lib/types";
import type { OutletEditFormValues } from "@/utils/schema";

export function outletToFormValues(
  outlet: CatalogOutlet | OutletDetail,
): OutletEditFormValues {
  return {
    name: outlet.name ?? "",
    address: outlet.address ?? "",
    city: outlet.city ?? "",
    phone: outlet.phone ?? "",
    image: null,
    existingImageUrl: outlet.image ?? "",
  };
}

export function formValuesToUpdateOutletPayload(
  values: OutletEditFormValues,
): UpdateOutletPayload {
  return {
    name: values.name.trim(),
    address: values.address.trim(),
    city: values.city.trim(),
    phone: values.phone.trim(),
  };
}
