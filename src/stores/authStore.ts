import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "@/types";
import { mockUsers } from "@/data/mockData";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole, email?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateAllergies: (allergies: string[]) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Default awal login sebagai Mahasiswa (Raven) untuk kemudahan development
      currentUser: mockUsers[0],
      isAuthenticated: true,

      login: (role: UserRole, email?: string) => {
        const user = mockUsers.find((u) => u.role === role) || {
          id: `user-${Date.now()}`,
          name: role === "BUYER" ? "Mahasiswa FILKOM" : "Mitra Penjual",
          email: email || (role === "BUYER" ? "mhs@student.ub.ac.id" : "kantin@filkom.ub.ac.id"),
          role,
          nim: role === "BUYER" ? "235150201111001" : undefined,
          standId: role === "SELLER" ? "stand-1" : undefined,
        };
        set({ currentUser: user, isAuthenticated: true });
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      // Fungsi saklar instan untuk demo IMK (ganti Pembeli <-> Penjual dalam 1 klik)
      switchRole: (role: UserRole) => {
        const targetUser = mockUsers.find((u) => u.role === role) || {
          id: `user-${role.toLowerCase()}`,
          name: role === "BUYER" ? "Raven Pratama" : "Pak Bambang (Stan 01)",
          email: role === "BUYER" ? "raven@student.ub.ac.id" : "bambang.filkom@gmail.com",
          role,
          nim: role === "BUYER" ? "235150201111045" : undefined,
          standId: role === "SELLER" ? "stand-1" : undefined,
        };
        set({ currentUser: targetUser, isAuthenticated: true });
      },

      updateAllergies: (allergies: string[]) => {
        const current = get().currentUser;
        if (current) {
          set({ currentUser: { ...current, allergies } });
        }
      },
    }),
    {
      name: "sajiin-auth-storage",
    }
  )
);