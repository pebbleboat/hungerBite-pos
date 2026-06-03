import type {
  AddMenuItemPayload,
  CatalogMenuItemRecord,
  MenuItem,
  MenuItemStatus,
} from "@/lib/types";
import type { MenuItemFormValues } from "@/utils/schema";

function menuStatus(status?: string): MenuItemStatus {
  const value = (status ?? "available").toLowerCase().replace(/\s+/g, "_");
  if (value === "unavailable") return "unavailable";
  if (value === "out_of_stock") return "out_of_stock";
  return "available";
}

/** Raw catalog item shape from API (may use `id` or `_id`). */
type CatalogMenuItemApiRecord = CatalogMenuItemRecord & { _id?: string };

function resolveCatalogItemId(raw: CatalogMenuItemApiRecord): string {
  const id = raw.id ?? raw._id;
  if (!id) {
    throw new Error("Menu item id missing from API response");
  }
  return String(id);
}

export function catalogRecordToMenuItem(raw: CatalogMenuItemApiRecord): MenuItem {
  const id = resolveCatalogItemId(raw);
  return {
    id,
    name: raw.name,
    sku: id.slice(-6).toUpperCase(),
    description: raw.description ?? "",
    price: raw.price ?? 0,
    imageUrl: raw.image,
    category: raw.category ?? "default",
    dietary: raw.dietary,
    status: menuStatus(raw.status),
  };
}

export function formValuesToMenuItemPayload(
  values: MenuItemFormValues,
): AddMenuItemPayload {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    category: values.category,
    dietary: values.dietary,
    price: Number(values.price),
    status: values.isAvailable ? "available" : "unavailable",
  };
}

export function menuItemToFormValues(item: MenuItem): MenuItemFormValues {
  return {
    name: item.name,
    description: item.description,
    category: item.category,
    dietary: item.dietary ?? "",
    price: String(item.price),
    isAvailable: item.status === "available",
    image: null,
    existingImageUrl: item.imageUrl ?? "",
  };
}
