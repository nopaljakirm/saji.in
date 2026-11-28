import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "@/types";

export interface ExtendedUser extends User {
  balance?: number; // Saldo SajiPay Mahasiswa
}

interface AuthState {
  currentUser: ExtendedUser | null;
  buyerUser: ExtendedUser | null;
  sellerUser: ExtendedUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setHasHydrated: (status: boolean) => void;
  login: (email: string, role: UserRole, standId?: string) => boolean;
  switchSellerStand: (standId: string, standName?: string) => void;
  registerBuyer: (data: { name: string; email: string; nim: string; faculty: string }) => void;
  registerSeller: (data: { name: string; email: string; standName: string; standLocation: string; category: string }) => string;
  topUpBalance: (amount: number) => void;
  deductBalance: (amount: number) => boolean;
  updateAllergies: (allergies: string[]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Default awal
      currentUser: null,
      buyerUser: null,
      sellerUser: null,
      isAuthenticated: false,
      isHydrated: false,

      setHasHydrated: (status) => {
        set({ isHydrated: status });
      },

      login: (email, role, targetStandId) => {
        if (role === "BUYER") {
          const buyer: ExtendedUser = {
            id: "user-buyer-1",
            name: "Alif Raditya Pratama",
            email: email || "alif.raditya@student.ub.ac.id",
            role: "BUYER",
            nim: "225150200111",
            faculty: "FILKOM UB",
            balance: 84500, // Rp 84.500 persis seperti di Figma
            allergies: ["Kacang"],
          };
          set({
            buyerUser: buyer,
            currentUser: buyer,
            isAuthenticated: true,
          });
          return true;
        } else {
          const selectedStand = targetStandId || "stand-1";
          const standNameMap: Record<string, string> = {
            "stand-1": "Ayam Geprek & Nasi Goreng FILKOM",
            "stand-2": "Soto Lamongan & Rawon Bu Darmi",
            "stand-3": "Baratie Drink & Coffee",
          };

          const seller: ExtendedUser = {
            id: `user-seller-${selectedStand}`,
            name: standNameMap[selectedStand] || "Pemilik Stan Kantin",
            email: email || `stan.${selectedStand}@filkom.ub.ac.id`,
            role: "SELLER",
            standId: selectedStand,
          };
          set({
            sellerUser: seller,
            currentUser: seller,
            isAuthenticated: true,
          });
          return true;
        }
      },

      switchSellerStand: (standId, standName) => {
        const currentSeller = get().sellerUser || get().currentUser;
        if (currentSeller && currentSeller.role === "SELLER") {
          const updated: ExtendedUser = {
            ...currentSeller,
            standId,
            name: standName || currentSeller.name,
          };
          set({
            sellerUser: updated,
            currentUser: updated,
          });
        }
      },

      registerBuyer: (data) => {
        const newUser: ExtendedUser = {
          id: `buyer-${Date.now()}`,
          name: data.name,
          email: data.email,
          role: "BUYER",
          nim: data.nim,
          faculty: data.faculty,
          balance: 50000, // Bonus saldo awal pendaftaran Rp 50.000
          allergies: [],
        };
        set({
          buyerUser: newUser,
          currentUser: newUser,
          isAuthenticated: true,
        });
      },

      registerSeller: (data) => {
        const newStandId = `stand-${Date.now()}`;
        const newUser: ExtendedUser = {
          id: `seller-${Date.now()}`,
          name: data.standName,
          email: data.email,
          role: "SELLER",
          standId: newStandId,
        };
        set({
          sellerUser: newUser,
          currentUser: newUser,
          isAuthenticated: true,
        });
        return newStandId;
      },

      topUpBalance: (amount) => {
        const user = get().buyerUser || get().currentUser;
        if (user) {
          const updated = {
            ...user,
            balance: (user.balance || 0) + amount,
          };
          set({
            buyerUser: updated,
            currentUser: updated,
          });
        }
      },

      deductBalance: (amount) => {
        const user = get().buyerUser || get().currentUser;
        if (user && (user.balance || 0) >= amount) {
          const updated = {
            ...user,
            balance: (user.balance || 0) - amount,
          };
          set({
            buyerUser: updated,
            currentUser: updated,
          });
          return true;
        }
        return false;
      },

      updateAllergies: (allergies: string[]) => {
        const user = get().buyerUser || get().currentUser;
        if (user) {
          const updated = {
            ...user,
            allergies,
          };
          set({
            buyerUser: updated,
            currentUser: updated,
          });
        }
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false, buyerUser: null, sellerUser: null });
      },
    }),
    {
      name: "sajiin-auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// SINKRONISASI REAL-TIME ANTAR TAB BROWSER
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "sajiin-auth-storage" && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (parsed.state) {
          useAuthStore.setState({
            currentUser: parsed.state.currentUser,
            buyerUser: parsed.state.buyerUser,
            sellerUser: parsed.state.sellerUser,
            isAuthenticated: parsed.state.isAuthenticated,
          });
        }
      } catch (e) {
        console.error("Gagal sinkronisasi sesi auth antar-tab", e);
      }
    }
  });
}
