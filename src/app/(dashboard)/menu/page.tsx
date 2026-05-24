"use client";

import AddItemCard from "@/app/(dashboard)/menu/components/AddItemCard";
import MenuFilters from "@/app/(dashboard)/menu/components/MenuFilters";
import MenuItemCard from "@/app/(dashboard)/menu/components/MenuItemCard";
import Button from "@/shared/buttons/Button";
import EmptyState from "@/shared/EmptyState";
import Text from "@/shared/heading/Text";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import { useHook } from "./useHook";

export default function MenuPage() {
  const {
    selectedOutletId,
    selectedOutlet,
    items,
    search,
    setSearch,
    category,
    setCategory,
    status,
    setStatus,
    isLoading,
    handleEditItem,
    handleDeleteItem,
  } = useHook();
  const router = useRouter();
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Text as="h1" size="2xl" type="bold" className="text-gray-900">
            Menu Management
          </Text>
          <Text size="sm" variant="secondary" className="mt-1">
            {selectedOutlet
              ? `Managing the menu for ${selectedOutlet.name}.`
              : "Update, organize, and manage your restaurant\u2019s digital menu."}
          </Text>
        </div>
        <Button
          type="button"
          btnName="Add New Item"
          icon={<FiPlus className="h-4 w-4" />}
          className="rounded-lg! bg-brand-950! py-2.5! text-white! hover:bg-brand-900!"
          onClick={() => router.push("/menu/add-item")}
          disabled={!selectedOutletId || isLoading}
        />
      </div>

      <MenuFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
      />
      <EmptyState pageData={isLoading ? null : items}>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          ))}
          <AddItemCard onClick={() => router.push("/menu/add-item")} />
        </div>
      </EmptyState>
    </div>
  );
}
