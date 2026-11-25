"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useOrderStore } from "@/stores/orderStore";
import StatusBadge from "@/components/ui/StatusBadge";
import BottomNav from "@/components/layout/BottomNav";
import {
  ArrowLeft,
  ChefHat,
  Box,
  CheckCircle2,
  KeyRound,
  Clock,
  Sparkles,
} from "lucide-react";

// Komponen Konten Utama
function OrderDetailContent() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [isMounted, setIsMounted] = useState(false);
  const { getOrderById, updateOrderStatus } = useOrderStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex-1 flex flex-col justify-between min-h-screen">
        <header className="p-4 bg-surface border-b border-border flex items-center gap-3">
          <Link href="/orders" className="p-1 text-foreground-secondary hover:text-foreground">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-foreground text-base">Memuat Detail Pesanan...</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <BottomNav />
      </div>
    );
  }

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="flex-1 flex flex-col justify-between min-h-screen p-6 text-center">
        <div className="my-auto">
          <h2 className="font-bold text-foreground text-base">Pesanan Tidak Ditemukan</h2>
          <p className="text-xs text-foreground-secondary mt-1">ID Pesanan &ldquo;{orderId}&rdquo; tidak terdaftar.</p>
          <Link
            href="/orders"
            className="mt-4 inline-block px-5 py-2 bg-primary text-white text-xs font-bold rounded-pill"
          >
            Kembali ke Daftar Pesanan
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  const isCooking = order.status === "COOKING";
  const isReady = order.status === "READY_IN_RACK";
  const isCompleted = order.status === "COMPLETED";

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      <div className="flex-1 pb-6 overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="p-4 bg-surface border-b border-border flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Link href="/orders" className="p-1 text-foreground-secondary hover:text-foreground">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-bold text-foreground text-base font-mono">{order.id}</h1>
              <p className="text-[11px] text-foreground-secondary">{order.standName}</p>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </header>

        {/* Hero Card Status Pesanan */}
        <div className="p-4">
          {/* State 1: Sedang Dimasak */}
          {isCooking && (
            <div className="p-5 bg-gradient-to-br from-[#FFF7DD] to-white border border-[#D99A00]/30 rounded-card shadow-sm text-center">
              <div className="w-16 h-16 bg-[#D99A00]/15 text-[#D99A00] rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                <ChefHat size={32} />
              </div>
              <h2 className="text-base font-bold text-foreground">Pesanan Sedang Dimasak!</h2>
              <p className="text-xs text-foreground-secondary mt-1.5 leading-relaxed max-w-[280px] mx-auto">
                Koki stan <strong>{order.standName}</strong> sedang meracik pesananmu. Begitu matang, makanan akan ditaruh di rak cerdas.
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-pill border border-[#D99A00]/20 text-xs font-semibold text-[#D99A00]">
                <Clock size={14} /> Estimasi siap: 8 - 12 Menit
              </div>
            </div>
          )}

          {/* State 2: Siap Diambil di Rak Cerdas */}
          {isReady && (
            <div className="p-5 bg-gradient-to-br from-[#EAF7EF] to-white border-2 border-status-success rounded-card shadow-md text-center">
              <div className="w-16 h-16 bg-status-success text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <Box size={32} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-status-success text-white px-2.5 py-0.5 rounded-pill">
                Makanan Siap!
              </span>
              <h2 className="text-lg font-bold text-foreground mt-2">Silakan Ambil di Rak</h2>
              <p className="text-xs text-foreground-secondary mt-1">
                Kantin Gedung F FILKOM UB (Lantai 1)
              </p>

              {/* Slot Rak & PIN Pengambilan */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-card border border-status-success/30 shadow-xs">
                  <span className="text-[10px] text-foreground-secondary block">Lokasi Slot:</span>
                  <span className="text-base font-extrabold text-status-success font-mono">
                    {order.rackSlot || "Rak B-03"}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-card border border-status-success/30 shadow-xs">
                  <span className="text-[10px] text-foreground-secondary block">PIN Buka Rak:</span>
                  <span className="text-base font-extrabold text-foreground font-mono tracking-widest">
                    {order.pickupPin || "5821"}
                  </span>
                </div>
              </div>

              <div className="mt-3.5 p-2.5 bg-white/80 rounded-card text-[11px] text-foreground-secondary flex items-center justify-center gap-1.5">
                <KeyRound size={14} className="text-status-success shrink-0" />
                <span>Ketik PIN di keypad locker atau tunjukkan ke petugas stan</span>
              </div>
            </div>
          )}

          {/* State 3: Selesai */}
          {isCompleted && (
            <div className="p-5 bg-surface border border-border rounded-card text-center shadow-xs">
              <div className="w-14 h-14 bg-status-success-soft text-status-success rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={30} />
              </div>
              <h2 className="text-base font-bold text-foreground">Pesanan Telah Selesai</h2>
              <p className="text-xs text-foreground-secondary mt-1">
                Makanan telah diambil. Selamat menikmati santapanmu!
              </p>
            </div>
          )}
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-6 right-6 top-3 h-0.5 bg-border -z-1" />

            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-status-success text-white flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
              <span className="text-[10px] text-foreground-secondary mt-1">Bayar</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCooking
                    ? "bg-status-warning text-white animate-pulse"
                    : isReady || isCompleted
                    ? "bg-status-success text-white"
                    : "bg-border text-foreground-secondary"
                }`}
              >
                {isReady || isCompleted ? "✓" : "2"}
              </div>
              <span className="text-[10px] text-foreground-secondary mt-1">Dapur</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isReady
                    ? "bg-status-success text-white ring-4 ring-status-success/20 animate-bounce"
                    : isCompleted
                    ? "bg-status-success text-white"
                    : "bg-border text-foreground-secondary"
                }`}
              >
                {isCompleted ? "✓" : "3"}
              </div>
              <span className="text-[10px] text-foreground-secondary mt-1">Rak Cerdas</span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCompleted ? "bg-status-success text-white" : "bg-border text-foreground-secondary"
                }`}
              >
                4
              </div>
              <span className="text-[10px] text-foreground-secondary mt-1">Selesai</span>
            </div>
          </div>
        </div>

        {/* Rincian Menu Pesanan */}
        <div className="mx-4 mt-4 p-4 bg-surface rounded-card border border-border shadow-xs">
          <h3 className="text-xs font-bold text-foreground mb-3">Detail Makanan & Minuman</h3>

          <div className="space-y-3">
            {order.items.map((it, idx) => (
              <div key={idx} className="flex gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                <img
                  src={it.menuItem.image}
                  alt={it.menuItem.name}
                  className="w-14 h-14 rounded-card object-cover border border-border/40 shrink-0"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-foreground">{it.menuItem.name}</h4>
                    <span className="text-xs font-bold text-foreground">
                      Rp {(it.menuItem.price * it.quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <span className="text-[11px] text-foreground-secondary">{it.quantity} Porsi</span>
                  {it.selectedHeat && (
                    <p className="text-[10px] text-primary-deep">• {it.selectedHeat}</p>
                  )}
                  {it.kitchenNote && (
                    <p className="text-[10px] text-foreground-secondary italic">
                      Catatan: &ldquo;{it.kitchenNote}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs font-bold">
            <span className="text-foreground">Total Bayar (QRIS)</span>
            <span className="text-primary text-sm">Rp {order.totalPrice.toLocaleString("id-ID")}</span>
          </div>
        </div>

        {/* WIDGET SIMULATOR UNTUK DEMO TUGAS IMK */}
        <div className="mx-4 mt-5 p-3.5 bg-primary-soft/80 border border-primary/30 rounded-card">
          <div className="flex items-center gap-1.5 text-primary-deep font-bold text-xs mb-2">
            <Sparkles size={14} />
            <span>Kontrol Simulasi Cepat (Demo IMK)</span>
          </div>
          <p className="text-[10px] text-foreground-secondary mb-2.5">
            Gunakan tombol ini jika ingin mensimulasikan perubahan status pesanan tanpa harus berpindah ke akun penjual:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateOrderStatus(order.id, "READY_IN_RACK", "Rak B-03")}
              disabled={isReady || isCompleted}
              className="py-2 px-2 bg-status-success hover:bg-emerald-700 disabled:opacity-40 text-white rounded-pill text-[10px] font-bold shadow-xs transition"
            >
              Simulasi: Makanan Jadi (Rak)
            </button>

            <button
              onClick={() => updateOrderStatus(order.id, "COMPLETED")}
              disabled={isCompleted}
              className="py-2 px-2 bg-foreground hover:bg-black disabled:opacity-40 text-white rounded-pill text-[10px] font-bold shadow-xs transition"
            >
              Simulasi: Ambil Selesai
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

// Wrapper Suspense untuk Prerendering Safe di Next.js 15/16
export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex flex-col justify-center items-center min-h-screen">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
          <span className="text-xs text-foreground-secondary">Memuat Pesanan...</span>
        </div>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}