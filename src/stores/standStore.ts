import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Stand, MenuItem } from "@/types";
import { mockStands, mockMenuItems } from "@/data/mockData";

export interface ExtendedMenuItem extends MenuItem {
  stockCount?: number;
  stockMax?: number;
  stockStatus?: "AMAN" | "HAMPIR_HABIS" | "HABIS";
}

interface StandState {
  stands: Stand[];
  menuItems: ExtendedMenuItem[];
  toggleStandOpen: (standId: string) => void;
  updateStandSettings: (
    standId: string,
    settings: { estimatedTime?: string; maxQueue?: number }
  ) => void;
  addStand: (stand: Stand) => void;
  addMenuItem: (menu: ExtendedMenuItem) => void;
  updateMenuItem: (menuId: string, updates: Partial<ExtendedMenuItem>) => void;
  decrementStock: (purchasedItems: { menuItemId: string; quantity: number }[]) => void;
  deleteMenuItem: (menuId: string) => void;
  getStandById: (standId: string) => Stand | undefined;
  getMenusByStand: (standId: string) => ExtendedMenuItem[];
}

export const useStandStore = create<StandState>()(
  persist(
    (set, get) => ({
      stands: mockStands,
      menuItems: mockMenuItems.map((m, idx) => ({
        ...m,
        stockCount: idx === 1 ? 5 : idx === 3 ? 35 : 20,
        stockMax: idx === 1 ? 25 : idx === 3 ? 50 : 30,
        stockStatus: idx === 1 ? "HAMPIR_HABIS" : "AMAN",
      })),

      toggleStandOpen: (standId) => {
        const updated = get().stands.map((s) =>
          s.id === standId ? { ...s, isOpen: !s.isOpen } : s
        );
        set({ stands: updated });
      },

      updateStandSettings: (standId, settings) => {
        const updated = get().stands.map((s) =>
          s.id === standId ? { ...s, ...settings } : s
        );
        set({ stands: updated });
      },

      addStand: (stand) => {
        set({ stands: [...get().stands, stand] });
      },

      addMenuItem: (menu) => {
        set({ menuItems: [menu, ...get().menuItems] });
      },

      updateMenuItem: (menuId, updates) => {
        const updated = get().menuItems.map((m) =>
          m.id === menuId ? { ...m, ...updates } : m
        );
        set({ menuItems: updated });
      },

      decrementStock: (purchasedItems) => {
        const currentMenus = [...get().menuItems];
        const updated = currentMenus.map((item) => {
          const purchased = purchasedItems.find((p) => p.menuItemId === item.id);
          if (purchased && item.stockCount !== undefined) {
            const newCount = Math.max(0, item.stockCount - purchased.quantity);
            const newStatus: "AMAN" | "HAMPIR_HABIS" | "HABIS" =
              newCount === 0 ? "HABIS" : newCount <= 5 ? "HAMPIR_HABIS" : "AMAN";
            return {
              ...item,
              stockCount: newCount,
              stockStatus: newStatus,
              isAvailable: newCount > 0,
            };
          }
          return item;
        });
        set({ menuItems: updated });
      },

      deleteMenuItem: (menuId) => {
        set({ menuItems: get().menuItems.filter((m) => m.id !== menuId) });
      },

      getStandById: (standId) => get().stands.find((s) => s.id === standId),
      getMenusByStand: (standId) => get().menuItems.filter((m) => m.standId === standId),
    }),
    {
      name: "sajiin-stands-storage",
    }
  )
);

// SINKRONISASI REAL-TIME ANTAR TAB BROWSER
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "sajiin-stands-storage" && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (parsed.state) {
          useStandStore.setState({
            stands: parsed.state.stands || [],
            menuItems: parsed.state.menuItems || [],
          });
        }
      } catch (e) {
        console.error("Gagal sinkronisasi data stan antar-tab", e);
      }
    }
  });
}
