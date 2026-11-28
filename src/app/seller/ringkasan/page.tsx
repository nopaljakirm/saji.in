"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useOrderStore } from "@/stores/orderStore";
import { useStandStore } from "@/stores/standStore";
import BottomNav from "@/components/layout/BottomNav";
import {
  TrendingUp,
  ChefHat,
  Box,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  QrCode,
  Store,
  ChevronRight,
} from "lucide-react";

export default function SellerRingkasanPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { currentUser } = useAuthStore();
  const { orders } = useOrderStore();
  const { stands } = useStandStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Proteksi rute aman di dalam useEffect
  useEffect(() => {
    if (isMounted && (!currentUser || currentUser.role !== "SELLER")) {
      router.replace("/login");
    }
  }, [isMounted, currentUser, router]);

  if (!isMounted || !currentUser || currentUser.role !== "SELLER") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
        <span className="text-xs text-foreground-secondary">Memuat Ringkasan Operasional...</span>
      </div>
    );
  }

  const currentStand = stands.find((s) => s.id === (currentUser.standId || "stand-1")) || stands[0];

  // Metrik Penjualan
  const cookingCount = orders.filter((o) => o.status === "COOKING").length;
  const readyCount = orders.filter((o) => o.status === "READY_IN_RACK").length;
  const completedCount = orders.filter((o) => o.status === "COMPLETED").length;
  const totalCount = orders.length;

  const totalOmzet = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      <div className="flex-1 pb-6 overflow-y-auto no-scrollbar">
        {/* Header Penjual (Persis Figma) */}
        <header className="p-4 bg-surface border-b border-border sticky top-0 z-20 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <Store size={14} className="text-primary" />
                <span>{currentStand?.name || "Warung Bu Siti"}</span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-pill ${
                    currentStand?.isOpen
                      ? "bg-status-success-soft text-status-success"
                      : "bg-status-danger-soft text-status-danger"
                  }`}
                >
                  {currentStand?.isOpen ? "● Buka" : "● Tutup"}
                </span>
              </div>
              <p className="text-[10px] text-foreground-secondary mt-0.5">
                Kantin Cerdas FILKOM • Stand #04
              </p>
            </div>

            <div className="w-8 h-8 rounded-full bg-primary-soft text-primary-deep font-bold text-xs flex items-center justify-center">
              BS
            </div>
          </div>
        </header>

        <div className="p-4 space-y-4">
          <div>
            <h1 className="text-base font-bold text-foreground">Ringkasan Operasional</h1>
            <p className="text-xs text-foreground-secondary">
              Pantau aktivitas & arus pesanan kantin hari ini
            </p>
          </div>

          {/* Banner Alert Stok Menipis (Persis Figma) */}
          <div className="p-3.5 bg-primary-soft border border-primary/30 rounded-card flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-pill bg-white flex items-center justify-center text-primary shrink-0 shadow-xs">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground leading-tight">
                  Ayam Geprek hampir habis
                </h4>
                <p className="text-[10px] text-foreground-secondary mt-0.5">
                  Tersisa 2 porsi dari kuota 25 porsi harian
                </p>
              </div>
            </div>

            <Link
              href="/seller/menu"
              className="px-3 py-1.5 bg-primary hover:bg-primary-deep text-white text-[11px] font-bold rounded-pill transition shadow-xs shrink-0"
            >
              Kelola Stok
            </Link>
          </div>

          {/* 4 Kartu Metrik Operasional (Persis Figma) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Total Masuk */}
            <div className="p-3.5 bg-surface rounded-card border border-border shadow-xs">
              <span className="text-[10px] text-foreground-secondary block">Total Masuk</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-black text-foreground">{totalCount || 24}</span>
                <span className="text-[10px] font-bold text-status-success">+18%</span>
              </div>
              <span className="text-[10px] text-foreground-secondary mt-0.5 block">Target harian 30</span>
            </div>

            {/* Sedang Masak */}
            <Link
              href="/seller/dapur"
              className="p-3.5 bg-surface rounded-card border border-[#D99A00]/30 hover:border-[#D99A00] transition shadow-xs block"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-foreground-secondary block">Sedang Masak</span>
                <ChefHat size={14} className="text-status-warning" />
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-black text-[#D99A00]">{cookingCount}</span>
                <span className="text-[10px] text-foreground-secondary">antrean</span>
              </div>
              <span className="text-[10px] text-foreground-secondary mt-0.5 block">Est. 8 - 12 menit</span>
            </Link>

            {/* Siap Diambil di Rak */}
            <Link
              href="/seller/penyerahan"
              className="p-3.5 bg-surface rounded-card border border-status-success/30 hover:border-status-success transition shadow-xs block"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] text-foreground-secondary block">Siap Diambil</span>
                <Box size={14} className="text-status-success" />
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-black text-status-success">{readyCount}</span>
                <span className="text-[10px] text-status-success font-semibold">Di Rak</span>
              </div>
              <span className="text-[10px] text-foreground-secondary mt-0.5 block">Menunggu scan PIN</span>
            </Link>

            {/* Selesai Hari Ini */}
            <div className="p-3.5 bg-surface rounded-card border border-border shadow-xs">
              <span className="text-[10px] text-foreground-secondary block">Selesai Hari Ini</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-black text-foreground">{completedCount || 13}</span>
                <span className="text-[10px] text-status-success font-bold">98% Tepat</span>
              </div>
              <span className="text-[10px] text-status-success font-semibold mt-0.5 block">Zero complaint</span>
            </div>
          </div>

          {/* Kartu Pendapatan Bersih Hari Ini (Persis Figma) */}
          <div className="p-4 bg-gradient-to-r from-primary-deep to-primary text-white rounded-card shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-semibold opacity-90 flex items-center gap-1">
                  <TrendingUp size={12} /> Pendapatan Bersih Hari Ini
                </span>
                <h3 className="text-2xl font-black mt-1 font-mono">
                  Rp {(totalOmzet || 438000).toLocaleString("id-ID")}
                </h3>
                <p className="text-[10px] opacity-85 mt-1">
                  <span className="font-bold text-white">+24.5%</span> vs kemarin (Rp 352.000)
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-pill text-[10px] font-bold">
                QRIS Live • {orders.length} Trx
              </div>
            </div>
          </div>

          {/* Visualisasi Arus Jam Sibuk Kantin (Persis Figma) */}
          <div className="p-4 bg-surface rounded-card border border-border shadow-xs">
            <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
              <Clock size={14} className="text-primary" /> Estimasi Jam Sibuk Kantin FILKOM
            </h4>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-background rounded-card">
                <span className="text-[10px] font-bold text-foreground-secondary block">08:00</span>
                <span className="text-xs font-bold text-foreground mt-0.5 block">Sepi</span>
              </div>
              <div className="p-2 bg-background rounded-card">
                <span className="text-[10px] font-bold text-foreground-secondary block">10:00</span>
                <span className="text-xs font-bold text-[#D99A00] mt-0.5 block">Sedang</span>
              </div>
              <div className="p-2 bg-primary-soft border border-primary/30 rounded-card">
                <span className="text-[10px] font-bold text-primary-deep block">12:00</span>
                <span className="text-xs font-extrabold text-primary mt-0.5 block">Puncak 🔥</span>
              </div>
              <div className="p-2 bg-background rounded-card">
                <span className="text-[10px] font-bold text-foreground-secondary block">14:00</span>
                <span className="text-xs font-bold text-foreground mt-0.5 block">Normal</span>
              </div>
            </div>
          </div>

          {/* Tombol Pintas Buka Dapur KDS */}
          <Link
            href="/seller/dapur"
            className="w-full py-3 bg-primary hover:bg-primary-deep text-white font-bold text-xs rounded-pill shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Buka Dapur KDS Masak ({cookingCount} Antrean)</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
