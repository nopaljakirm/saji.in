"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useOrderStore } from "@/stores/orderStore";
import { useStandStore } from "@/stores/standStore";
import BottomNav from "@/components/layout/BottomNav";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  ChefHat,
  Box,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  Check,
  Store,
} from "lucide-react";

export default function SellerDapurPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [filterTab, setFilterTab] = useState<"ALL" | "COOKING" | "READY">("ALL");

  const { currentUser } = useAuthStore();
  const { orders, updateOrderStatus } = useOrderStore();
  const { stands } = useStandStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Proteksi di dalam useEffect
  useEffect(() => {
    if (isMounted && (!currentUser || currentUser.role !== "SELLER")) {
      router.replace("/login");
    }
  }, [isMounted, currentUser, router]);

  if (!isMounted || !currentUser || currentUser.role !== "SELLER") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
        <span className="text-xs text-foreground-secondary">Memuat Dapur KDS...</span>
      </div>
    );
  }

  const currentStand = stands.find((s) => s.id === (currentUser?.standId || "stand-1")) || stands[0];

  const standOrders = orders.filter(
    (o) => !currentUser?.standId || o.standId === currentUser.standId
  );

  const cookingOrders = standOrders.filter((o) => o.status === "COOKING");
  const readyOrders = standOrders.filter((o) => o.status === "READY_IN_RACK");

  const displayedOrders =
    filterTab === "COOKING"
      ? cookingOrders
      : filterTab === "READY"
      ? readyOrders
      : standOrders.filter((o) => o.status === "COOKING" || o.status === "READY_IN_RACK");

  const handleMarkReady = (orderId: string) => {
    const randomSlots = ["Rak A-01", "Rak A-02", "Rak B-01", "Rak B-02", "Rak B-03", "Rak C-01"];
    const allocatedSlot = randomSlots[Math.floor(Math.random() * randomSlots.length)];
    updateOrderStatus(orderId, "READY_IN_RACK", allocatedSlot);
  };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      <div className="flex-1 pb-6 overflow-y-auto no-scrollbar">
        {/* Header Penjual */}
        <header className="p-4 bg-surface border-b border-border sticky top-0 z-20 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-bold text-status-success uppercase tracking-wider flex items-center gap-1">
                <Store size={12} /> Dapur KDS • {currentStand?.name || "Warung Bu Siti"}
              </span>
              <h1 className="text-base font-bold text-foreground">
                Pesanan Masuk
              </h1>
            </div>

            <div className="w-8 h-8 rounded-full bg-primary-soft text-primary-deep font-bold text-xs flex items-center justify-center">
              BS
            </div>
          </div>

          {/* Filter Tab KDS */}
          <div className="flex gap-2 mt-3 pt-2 border-t border-border/50">
            <button
              onClick={() => setFilterTab("ALL")}
              className={`px-3 py-1.5 rounded-pill text-xs font-semibold transition ${
                filterTab === "ALL"
                  ? "bg-foreground text-white shadow-xs"
                  : "bg-background text-foreground-secondary hover:text-foreground"
              }`}
            >
              Semua ({cookingOrders.length + readyOrders.length})
            </button>
            <button
              onClick={() => setFilterTab("COOKING")}
              className={`px-3 py-1.5 rounded-pill text-xs font-semibold flex items-center gap-1.5 transition ${
                filterTab === "COOKING"
                  ? "bg-status-warning text-white shadow-xs"
                  : "bg-background text-foreground-secondary hover:text-foreground"
              }`}
            >
              <ChefHat size={14} /> Perlu Dimasak ({cookingOrders.length})
            </button>
            <button
              onClick={() => setFilterTab("READY")}
              className={`px-3 py-1.5 rounded-pill text-xs font-semibold flex items-center gap-1.5 transition ${
                filterTab === "READY"
                  ? "bg-status-success text-white shadow-xs"
                  : "bg-background text-foreground-secondary hover:text-foreground"
              }`}
            >
              <Box size={14} /> Di Rak ({readyOrders.length})
            </button>
          </div>
        </header>

        {/* Daftar Tiket Dapur */}
        <div className="p-4 space-y-4">
          {displayedOrders.length === 0 ? (
            <div className="p-8 text-center bg-surface rounded-card border border-border mt-8">
              <div className="w-14 h-14 bg-status-success-soft text-status-success rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="font-bold text-foreground text-sm">Semua Tiket Selesai!</h3>
              <p className="text-foreground-secondary text-xs mt-1">
                Tidak ada antrean pesanan yang perlu dimasak saat ini.
              </p>
            </div>
          ) : (
            displayedOrders.map((order) => {
              const isCooking = order.status === "COOKING";

              return (
                <div
                  key={order.id}
                  className={`rounded-card border shadow-xs overflow-hidden transition ${
                    isCooking
                      ? "bg-surface border-status-warning/40 shadow-sm"
                      : "bg-[#EAF7EF]/20 border-status-success/30"
                  }`}
                >
                  <div className="p-3.5 bg-background border-b border-border flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold font-mono text-foreground">
                          {order.id}
                        </span>
                        <StatusBadge status={order.status} size="sm" />
                      </div>
                      <p className="text-[11px] text-foreground-secondary mt-0.5">
                        Pemesan: <strong>{order.buyerName}</strong> • {order.createdAt}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-foreground">
                        Rp {order.totalPrice.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[10px] text-status-success font-semibold block">
                        LUNAS (QRIS)
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-3">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-primary-soft text-primary-deep font-bold rounded-full text-xs flex items-center justify-center shrink-0">
                              {it.quantity}x
                            </span>
                            <span className="text-xs font-bold text-foreground">
                              {it.menuItem.name}
                            </span>
                          </div>

                          <div className="ml-7 text-[11px] space-y-0.5 mt-0.5">
                            {it.selectedHeat && (
                              <p className="text-primary-deep font-medium flex items-center gap-1">
                                <Flame size={11} /> {it.selectedHeat}
                              </p>
                            )}
                            {it.selectedPortion && (
                              <p className="text-foreground-secondary">• {it.selectedPortion}</p>
                            )}
                            {it.kitchenNote && (
                              <p className="text-[#D99A00] font-semibold italic">
                                &ldquo;{it.kitchenNote}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-surface border-t border-border flex items-center justify-between">
                    {isCooking ? (
                      <button
                        onClick={() => handleMarkReady(order.id)}
                        className="w-full py-2.5 px-4 bg-status-success hover:bg-emerald-700 text-white font-bold text-xs rounded-pill shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Box size={16} />
                        Selesai Masak & Taruh di Rak Cerdas →
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-between text-xs">
                        <span className="text-status-success font-semibold flex items-center gap-1.5">
                          <Check size={16} /> Berada di: <strong>{order.rackSlot}</strong>
                        </span>
                        <span className="text-[11px] font-mono bg-background px-2 py-0.5 rounded border border-border text-foreground-secondary">
                          PIN: {order.pickupPin}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
