import type { AddMenuItemPayload, MenuItem } from "@/lib/types";
import type { MenuItemFormValues } from "@/utils/schema";

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
