import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "@/types";

export interface ExtendedUser extends User {
  balance?: number; // Saldo SajiPay Mahasiswa
}

interface AuthState {
  currentUser: ExtendedUser | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => boolean;
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
      // Default awal: Belum login (null) agar alur selalu dimulai dari halaman Login sesuai permintaan
      currentUser: null,
      isAuthenticated: false,

      login: (email, role) => {
        if (role === "BUYER") {
          set({
            currentUser: {
              id: "user-buyer-1",
              name: "Alif Raditya Pratama",
              email: email || "alif.raditya@student.ub.ac.id",
              role: "BUYER",
              nim: "225150200111",
              faculty: "FILKOM UB",
              balance: 84500, // Rp 84.500 persis seperti di Figma
              allergies: ["Kacang"],
            },
            isAuthenticated: true,
          });
          return true;
        } else {
          set({
            currentUser: {
              id: "user-seller-1",
              name: "Warung Bu Siti",
              email: email || "busiti.filkom@gmail.com",
              role: "SELLER",
              standId: "stand-1",
            },
            isAuthenticated: true,
          });
          return true;
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
        set({ currentUser: newUser, isAuthenticated: true });
      },

      registerSeller: (data) => {
        const newStandId = `stand-${Date.now()}`;
        const newUser: ExtendedUser = {
          id: `seller-${Date.now()}`,
          name: data.name,
          email: data.email,
          role: "SELLER",
          standId: newStandId,
        };
        set({ currentUser: newUser, isAuthenticated: true });
        return newStandId;
      },

      topUpBalance: (amount) => {
        const user = get().currentUser;
        if (user && user.role === "BUYER") {
          set({
            currentUser: {
              ...user,
              balance: (user.balance || 0) + amount,
            },
          });
        }
      },

      deductBalance: (amount) => {
        const user = get().currentUser;
        if (user && (user.balance || 0) >= amount) {
          set({
            currentUser: {
              ...user,
              balance: (user.balance || 0) - amount,
            },
          });
          return true;
        }
        return false;
      },

      updateAllergies: (allergies: string[]) => {
        const user = get().currentUser;
        if (user) {
          set({
            currentUser: {
              ...user,
              allergies,
            },
          });
        }
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
    }),
    {
      name: "sajiin-auth-storage",
    }
  )
);
