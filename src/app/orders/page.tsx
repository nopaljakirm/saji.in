"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useOrderStore } from "@/stores/orderStore";
import BottomNav from "@/components/layout/BottomNav";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  ArrowLeft,
  Clock,
  ChevronRight,
  Store,
  Box,
  ShoppingBag,
  History,
  Sparkles,
} from "lucide-react";

export default function OrdersListPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { currentUser, buyerUser } = useAuthStore();
  const { getOrdersByBuyer } = useOrderStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeBuyer = buyerUser || (currentUser?.role === "BUYER" ? currentUser : null);

  if (!isMounted) {
    return (
      <div className="flex-1 flex flex-col justify-between min-h-screen">
        <header className="p-4 bg-surface border-b border-border flex items-center gap-3">
          <Link href="/" className="p-1 text-foreground-secondary hover:text-foreground">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-foreground text-base">Pesanan Aktif</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <BottomNav />
      </div>
    );
  }

  const buyerOrders = activeBuyer ? getOrdersByBuyer(activeBuyer.id) : [];

  // HANYA ambil pesanan yang SEDANG AKTIF (Dimasak atau Siap di Rak)
  const activeOrders = buyerOrders.filter(
    (o) => o.status === "COOKING" || o.status === "READY_IN_RACK"
  );
  const pastOrdersCount = buyerOrders.filter((o) => o.status === "COMPLETED").length;

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      <div className="flex-1 pb-6 overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="p-4 bg-surface border-b border-border flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-1 text-foreground-secondary hover:text-foreground">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-bold text-foreground text-base">Pesanan Aktif</h1>
              <p className="text-[11px] text-foreground-secondary">Pantau status antrean dapur & loker</p>
            </div>
          </div>
          <span className="text-xs font-bold bg-primary-soft text-primary-deep px-2.5 py-0.5 rounded-pill">
            {activeOrders.length} Aktif
          </span>
        </header>

        <div className="p-4 space-y-4">
          {activeOrders.length === 0 ? (
            /* Tampilan jika tidak ada pesanan yang sedang diproses */
            <div className="flex flex-col items-center justify-center p-8 text-center mt-8 bg-surface rounded-card border border-border">
              <div className="w-16 h-16 bg-primary-soft text-primary rounded-full flex items-center justify-center mb-3 shadow-inner">
                <ShoppingBag size={28} />
              </div>
              <h3 className="font-bold text-foreground text-sm">Tidak Ada Pesanan Aktif</h3>
              <p className="text-foreground-secondary text-xs mt-1 max-w-[240px]">
                Semua pesananmu sudah diambil atau kamu belum memesan makanan hari ini.
              </p>

              <div className="mt-5 flex flex-col w-full gap-2">
                <Link
                  href="/"
                  className="w-full py-2.5 bg-primary hover:bg-primary-deep text-white text-xs font-bold rounded-pill shadow-xs transition"
                >
                  Pesan Menu Baru
                </Link>

                {pastOrdersCount > 0 && (
                  <Link
                    href="/history"
                    className="w-full py-2 bg-background hover:bg-foreground/5 text-foreground text-xs font-semibold rounded-pill border border-border transition flex items-center justify-center gap-1.5"
                  >
                    <History size={14} /> Lihat Riwayat Transaksi ({pastOrdersCount})
                  </Link>
                )}
              </div>
            </div>
          ) : (
            /* Daftar Kartu Pesanan yang Sedang Aktif */
            <div className="space-y-3.5">
              {activeOrders.map((order) => {
                const isReady = order.status === "READY_IN_RACK";

                return (
                  <div
                    key={order.id}
                    onClick={() => router.push(`/orders/${order.id}`)}
                    className={`p-4 rounded-card border transition cursor-pointer shadow-xs ${
                      isReady
                        ? "bg-status-success-soft/30 border-status-success/50 hover:border-status-success ring-1 ring-status-success/20"
                        : "bg-surface border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2.5 pb-2.5 border-b border-border/50">
                      <div>
                        <span className="text-xs font-bold text-foreground font-mono">
                          {order.id}
                        </span>
                        <p className="text-[11px] text-foreground-secondary flex items-center gap-1 mt-0.5">
                          <Store size={12} className="text-primary" /> {order.standName}
                        </p>
                      </div>
                      <StatusBadge status={order.status} size="sm" />
                    </div>

                    {/* Rincian Menu */}
                    <div className="text-xs text-foreground space-y-1 mb-3">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-[11px]">
                          <span>
                            {it.quantity}x {it.menuItem.name}
                          </span>
                          <span className="text-foreground-secondary">
                            Rp {(it.menuItem.price * it.quantity).toLocaleString("id-ID")}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Banner Spesial jika sudah di Rak Cerdas */}
                    {isReady ? (
                      <div className="p-3 bg-white rounded-card border border-status-success/40 mb-3 shadow-xs flex items-center justify-between">
                        <div className="flex items-center gap-2 text-status-success">
                          <Box size={18} className="animate-bounce" />
                          <div>
                            <span className="text-[10px] text-foreground-secondary block">
                              Ambil di Slot:
                            </span>
                            <span className="text-xs font-bold font-mono text-status-success">
                              {order.rackSlot}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-foreground-secondary block">PIN Buka:</span>
                          <span className="text-xs font-mono font-extrabold bg-status-success-soft text-status-success px-2 py-0.5 rounded border border-status-success/20">
                            {order.pickupPin}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-[#FFF7DD] rounded-card border border-[#D99A00]/20 mb-3 flex items-center gap-2 text-[#D99A00] text-[11px] font-medium">
                        <Clock size={14} className="shrink-0" />
                        <span>Koki sedang memasak, estimasi 8-12 menit...</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                      <span className="text-foreground-secondary text-[11px]">Total Tagihan</span>
                      <div className="flex items-center gap-1 text-primary font-bold">
                        <span>Rp {order.totalPrice.toLocaleString("id-ID")}</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Tautan Pintas ke Riwayat Transaksi */}
              <div className="pt-2 text-center">
                <Link
                  href="/history"
                  className="text-xs text-foreground-secondary hover:text-primary font-semibold inline-flex items-center gap-1 transition"
                >
                  <History size={14} />
                  <span>Lihat Riwayat Transaksi yang Sudah Selesai</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}