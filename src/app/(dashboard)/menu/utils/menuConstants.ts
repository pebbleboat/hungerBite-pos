import type { MenuItem, MenuItemStatus } from "@/lib/types";

export const MENU_CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "burgers", label: "Burgers" },
  { value: "pizza", label: "Pizza" },
  { value: "drinks", label: "Drinks" },
  { value: "salads", label: "Salads" },
  { value: "desserts", label: "Desserts" },
];

export const MENU_DIETARY_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "non_vegetarian", label: "Non-Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "eggetarian", label: "Eggetarian" },
] as const;

export const MENU_STATUS_OPTIONS: { value: "all" | MenuItemStatus; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
  { value: "out_of_stock", label: "Out of stock" },
];

export const CATEGORY_GRADIENTS: Record<string, string> = {
  burgers: "from-orange-400 via-amber-500 to-red-500",
  pizza: "from-amber-400 via-orange-500 to-rose-500",
  drinks: "from-amber-700 via-amber-800 to-stone-900",
  salads: "from-lime-400 via-emerald-500 to-teal-600",
  desserts: "from-yellow-600 via-orange-700 to-amber-900",
  default: "from-gray-300 via-gray-400 to-gray-500",
};

export const CATEGORY_EMOJI: Record<string, string> = {
  burgers: "🍔",
  pizza: "🍕",
  drinks: "🥤",
  salads: "🥗",
  desserts: "🍰",
  default: "🍽️",
};

/**
 * Stub data — replace with API response when the menu service is wired in.
 */
export const STUB_MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Double Bacon Cheeseburger",
    sku: "B-001",
    description:
      "Two grass-fed patties, applewood smoked bacon, sharp cheddar, and house-made aioli on a brioche bun.",
    price: 18.5,
    category: "burgers",
    status: "available",
  },
  {
    id: "2",
    name: "Truffle Mushroom Pizza",
    sku: "P-104",
    description:
      "Wild mushrooms, truffle oil, mozzarella, and roasted garlic on a hand-stretched sourdough base.",
    price: 22,
    category: "pizza",
    status: "available",
  },
  {
    id: "3",
    name: "Artisan Craft Cola",
    sku: "D-202",
    description:
      "Small-batch brewed botanical cola with natural cane sugar and citrus oils, served chilled.",
    price: 4.5,
    category: "drinks",
    status: "available",
  },
  {
    id: "4",
    name: "Classic Greek Salad",
    sku: "S-305",
    description:
      "Crisp cucumbers, kalamata olives, heirloom tomatoes, and aged feta with lemon oregano dressing.",
    price: 14,
    category: "salads",
    status: "available",
  },
  {
    id: "5",
    name: "Molten Chocolate Cake",
    sku: "D-401",
    description:
      "Warm dark chocolate cake with a liquid core, served with vanilla bean ice cream.",
    price: 9.5,
    category: "desserts",
    status: "available",
  },
];
