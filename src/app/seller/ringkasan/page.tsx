"use client";

import { useState, useEffect } from "react";
import { useOrderStore } from "@/stores/orderStore";
import BottomNav from "@/components/layout/BottomNav";
import RoleSwitcherPill from "@/components/layout/RoleSwitcherPill";
import {
  TrendingUp,
  ShoppingBag,
  ChefHat,
  Box,
  DollarSign,
  Store,
} from "lucide-react";

export default function SellerRingkasanPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { orders } = useOrderStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const totalOmzet = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const cookingCount = orders.filter((o) => o.status === "COOKING").length;
  const rackCount = orders.filter((o) => o.status === "READY_IN_RACK").length;
  const completedCount = orders.filter((o) => o.status === "COMPLETED").length;

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      <div className="flex-1 pb-6 overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="p-4 bg-surface border-b border-border sticky top-0 z-20">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-bold text-status-success uppercase tracking-wider flex items-center gap-1">
                <Store size={12} /> Dashboard Stan 01
              </span>
              <h1 className="text-base font-bold text-foreground">
                Ringkasan Penjualan
              </h1>
            </div>
            <RoleSwitcherPill />
          </div>
        </header>

        <div className="p-4 space-y-4">
          {/* Card Omzet Hari Ini */}
          <div className="p-5 bg-gradient-to-r from-primary to-primary-deep text-white rounded-card shadow-md">
            <span className="text-[11px] font-semibold opacity-90 flex items-center gap-1">
              <TrendingUp size={14} /> Total Omzet Hari Ini (QRIS)
            </span>
            <h2 className="text-2xl font-black mt-1 font-mono">
              Rp {totalOmzet.toLocaleString("id-ID")}
            </h2>
            <p className="text-[10px] opacity-80 mt-1">
              Kantin Cerdas FILKOM • Transaksi non-tunai langsung masuk
            </p>
          </div>

          {/* Grid Metrik Antrean */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-surface rounded-card border border-border text-center shadow-xs">
              <ChefHat size={18} className="text-status-warning mx-auto mb-1" />
              <span className="text-lg font-bold text-foreground block">{cookingCount}</span>
              <span className="text-[10px] text-foreground-secondary">Dimasak</span>
            </div>

            <div className="p-3 bg-surface rounded-card border border-border text-center shadow-xs">
              <Box size={18} className="text-status-success mx-auto mb-1" />
              <span className="text-lg font-bold text-foreground block">{rackCount}</span>
              <span className="text-[10px] text-foreground-secondary">Di Rak</span>
            </div>

            <div className="p-3 bg-surface rounded-card border border-border text-center shadow-xs">
              <ShoppingBag size={18} className="text-foreground-secondary mx-auto mb-1" />
              <span className="text-lg font-bold text-foreground block">{completedCount}</span>
              <span className="text-[10px] text-foreground-secondary">Selesai</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}