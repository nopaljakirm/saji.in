"use client";

import { useAuthStore } from "@/stores/authStore";
import { UserCheck, Store, RefreshCw } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function RoleSwitcherPill() {
  const { currentUser, switchRole } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  if (!currentUser) return null;

  const isBuyer = currentUser.role === "BUYER";

  const handleToggle = () => {
    if (isBuyer) {
      switchRole("SELLER");
      router.push("/seller/dapur");
    } else {
      switchRole("BUYER");
      router.push("/");
    }
  };

  return (
    <div className="bg-surface/90 backdrop-blur-md border border-border px-3 py-1.5 rounded-pill shadow-sm flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        {isBuyer ? (
          <span className="flex items-center gap-1 text-primary-deep">
            <UserCheck size={14} className="text-primary" />
            Mode Mahasiswa
          </span>
        ) : (
          <span className="flex items-center gap-1 text-status-success">
            <Store size={14} />
            Mode Penjual (Dapur)
          </span>
        )}
      </div>

      <button
        onClick={handleToggle}
        className="text-[10px] bg-foreground/5 hover:bg-foreground/10 text-foreground px-2 py-0.5 rounded-pill flex items-center gap-1 transition"
        title="Klik untuk beralih mode"
      >
        <RefreshCw size={10} />
        Ganti
      </button>
    </div>
  );
}