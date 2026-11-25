"use client";

import { useAuthStore } from "@/stores/authStore";
import { useOrderStore } from "@/stores/orderStore";
import { ChevronRight, Sparkles, Box } from "lucide-react";
import Link from "next/navigation";
import { useRouter, usePathname } from "next/navigation";

export default function ActiveOrderPill() {
  const { currentUser } = useAuthStore();
  const { getActiveOrderForBuyer } = useOrderStore();
  const router = useRouter();
  const pathname = usePathname();

  // Hanya tampilkan jika user adalah BUYER dan sedang tidak di halaman detail pesanan
  if (!currentUser || currentUser.role !== "BUYER" || pathname.startsWith("/orders")) {
    return null;
  }

  const activeOrder = getActiveOrderForBuyer(currentUser.id);
  if (!activeOrder) return null;

  const isReady = activeOrder.status === "READY_IN_RACK";

  return (
    <div
      onClick={() => router.push(`/orders/${activeOrder.id}`)}
      className="mx-4 mb-2 p-3 bg-white rounded-card shadow-md border border-border cursor-pointer transition active:scale-[0.98] hover:border-primary/40 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-pill flex items-center justify-center shrink-0 ${
            isReady ? "bg-status-success-soft text-status-success animate-pulse" : "bg-primary-soft text-primary"
          }`}
        >
          {isReady ? <Box size={20} /> : <Sparkles size={20} />}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground">{activeOrder.id}</span>
            <span className="text-[10px] text-foreground-secondary">• {activeOrder.standName}</span>
          </div>
          <p className="text-xs font-semibold text-primary-deep mt-0.5">
            {isReady ? `Siap Diambil di ${activeOrder.rackSlot}!` : "Pesanan sedang dimasak di dapur..."}
          </p>
        </div>
      </div>

      <div className="flex items-center text-primary font-bold text-xs gap-0.5">
        <span>Pantau</span>
        <ChevronRight size={16} />
      </div>
    </div>
  );
}