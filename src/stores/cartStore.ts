import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, MenuItem } from "@/types";

interface CartState {
  items: CartItem[];
  standId: string | null;
  standName: string | null;
  addItem: (
    menuItem: MenuItem,
    standName: string,
    quantity?: number,
    options?: {
      selectedHeat?: string;
      selectedPortion?: string;
      kitchenNote?: string;
    }
  ) => { success: boolean; conflict?: boolean };
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      standId: null,
      standName: null,

      addItem: (menuItem, standName, quantity = 1, options = {}) => {
        const { items, standId } = get();

        // Validasi: 1 Keranjang hanya boleh dari 1 stan yang sama
        if (standId && standId !== menuItem.standId && items.length > 0) {
          return { success: false, conflict: true };
        }

        const existingIndex = items.findIndex(
          (item) =>
            item.menuItem.id === menuItem.id &&
            item.selectedHeat === options.selectedHeat &&
            item.selectedPortion === options.selectedPortion
        );

        let newItems: CartItem[];
        if (existingIndex > -1) {
          newItems = [...items];
          newItems[existingIndex].quantity += quantity;
          if (options.kitchenNote) {
            newItems[existingIndex].kitchenNote = options.kitchenNote;
          }
        } else {
          newItems = [
            ...items,
            {
              menuItem,
              quantity,
              selectedHeat: options.selectedHeat,
              selectedPortion: options.selectedPortion,
              kitchenNote: options.kitchenNote,
            },
          ];
        }

        set({
          items: newItems,
          standId: menuItem.standId,
          standName: standName,
        });

        return { success: true };
      },

      removeItem: (menuItemId: string) => {
        const { items } = get();
        const filtered = items.filter((item) => item.menuItem.id !== menuItemId);
        set({
          items: filtered,
          standId: filtered.length === 0 ? null : get().standId,
          standName: filtered.length === 0 ? null : get().standName,
        });
      },

      updateQuantity: (menuItemId: string, quantity: number) => {
        const { items } = get();
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        const updated = items.map((item) =>
          item.menuItem.id === menuItemId ? { ...item, quantity } : item
        );
        set({ items: updated });
      },

      clearCart: () => {
        set({ items: [], standId: null, standName: null });
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          let itemPrice = item.menuItem.price;
          // Cek jika porsi kenyang menambah biaya
          if (item.selectedPortion?.includes("+Rp 3.000")) {
            itemPrice += 3000;
          }
          return total + itemPrice * item.quantity;
        }, 0);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "sajiin-cart-storage",
    }
  )
);