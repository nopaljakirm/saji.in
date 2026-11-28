"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useOrderStore } from "@/stores/orderStore";
import { useCartStore } from "@/stores/cartStore";
import BottomNav from "@/components/layout/BottomNav";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  ArrowLeft,
  Store,
  RotateCcw,
  Receipt,
  ChevronRight,
  ShoppingBag,
  Calendar,
} from "lucide-react";

export default function HistoryPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"ALL" | "COMPLETED" | "CANCELLED">("ALL");

  const { currentUser } = useAuthStore();
  const { getOrdersByBuyer } = useOrderStore();
  const { addItem, clearCart } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex-1 flex flex-col justify-between min-h-screen">
        <header className="p-4 bg-surface border-b border-border flex items-center gap-3">
          <Link href="/" className="p-1 text-foreground-secondary hover:text-foreground">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-foreground text-base">Riwayat Transaksi</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <BottomNav />
      </div>
    );
  }

  // Ambil semua pesanan milik mahasiswa yang sedang login
  const buyerOrders = currentUser ? getOrdersByBuyer(currentUser.id) : [];

  // Filter berdasarkan tab
  const filteredOrders = buyerOrders.filter((order) => {
    if (activeTab === "COMPLETED") return order.status === "COMPLETED";
    if (activeTab === "CANCELLED") return order.status === "CANCELLED";
    return true; // "ALL"
  });

  // Handler fitur "Pesan Lagi"
  const handleReorder = (order: (typeof buyerOrders)[0]) => {
    clearCart();
    order.items.forEach((it) => {
      addItem(it.menuItem, order.standName, it.quantity, {
        selectedHeat: it.selectedHeat,
        selectedPortion: it.selectedPortion,
        kitchenNote: it.kitchenNote,
      });
    });
    router.push("/cart");
  };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      <div className="flex-1 pb-6 overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="p-4 bg-surface border-b border-border sticky top-0 z-20 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-1 text-foreground-secondary hover:text-foreground">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="font-bold text-foreground text-base">Riwayat Transaksi</h1>
                <p className="text-[11px] text-foreground-secondary flex items-center gap-1">
                  <Calendar size={12} /> Semester Ganjil 2024/2025
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-primary font-mono">
              {filteredOrders.length} Nota
            </span>
          </div>

          {/* Filter Tabs (Persis Figma: Semua, Selesai, Dibatalkan) */}
          <div className="flex gap-2 pt-2 border-t border-border/50">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3.5 py-1.5 rounded-pill text-xs font-semibold transition ${
                activeTab === "ALL"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-background text-foreground-secondary hover:text-foreground border border-border/60"
              }`}
            >
              Semua ({buyerOrders.length})
            </button>

            <button
              onClick={() => setActiveTab("COMPLETED")}
              className={`px-3.5 py-1.5 rounded-pill text-xs font-semibold transition ${
                activeTab === "COMPLETED"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-background text-foreground-secondary hover:text-foreground border border-border/60"
              }`}
            >
              Selesai ({buyerOrders.filter((o) => o.status === "COMPLETED").length})
            </button>

            <button
              onClick={() => setActiveTab("CANCELLED")}
              className={`px-3.5 py-1.5 rounded-pill text-xs font-semibold transition ${
                activeTab === "CANCELLED"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-background text-foreground-secondary hover:text-foreground border border-border/60"
              }`}
            >
              Dibatalkan ({buyerOrders.filter((o) => o.status === "CANCELLED").length})
            </button>
          </div>
        </header>

        {/* Konten Daftar Riwayat Transaksi */}
        <div className="p-4 space-y-3.5">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center bg-surface rounded-card border border-border mt-8">
              <div className="w-14 h-14 bg-primary-soft text-primary rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Receipt size={28} />
              </div>
              <h3 className="font-bold text-foreground text-sm">
                {activeTab === "CANCELLED"
                  ? "Belum Ada Transaksi yang Dibatalkan"
                  : "Belum Ada Riwayat Transaksi"}
              </h3>
              <p className="text-foreground-secondary text-xs mt-1 max-w-[240px] mx-auto">
                {activeTab === "CANCELLED"
                  ? "Semua pesananmu di kantin FILKOM terselesaikan dengan lancar."
                  : "Transaksi makanan dan minuman yang kamu beli akan tersimpan rapi di sini."}
              </p>
              {activeTab === "ALL" && (
                <Link
                  href="/"
                  className="mt-4 inline-block px-5 py-2 bg-primary text-white text-xs font-bold rounded-pill shadow-xs"
                >
                  Pesan Makanan Sekarang
                </Link>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => {
              // Rangkuman nama menu
              const itemsSummary = order.items
                .map((it) => `${it.menuItem.name} (${it.quantity})`)
                .join(" + ");

              return (
                <div
                  key={order.id}
                  className="p-3.5 bg-surface rounded-card border border-border shadow-xs hover:border-primary/40 transition"
                >
                  {/* Baris Atas: Stand Name & Status */}
                  <div className="flex items-start justify-between pb-2.5 border-b border-border/50">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Store size={13} className="text-primary" />
                        <span className="text-xs font-bold text-foreground">{order.standName}</span>
                      </div>
                      <span className="text-[11px] font-mono text-foreground-secondary mt-0.5 block">
                        {order.id} • {order.createdAt}
                      </span>
                    </div>
                    <StatusBadge status={order.status} size="sm" />
                  </div>

                  {/* Ringkasan Makanan */}
                  <div className="py-2.5">
                    <p className="text-xs font-bold text-foreground leading-snug line-clamp-2">
                      {itemsSummary}
                    </p>
                    <p className="text-[11px] text-foreground-secondary mt-1">
                      Total:{" "}
                      <strong className="text-foreground font-semibold">
                        Rp {order.totalPrice.toLocaleString("id-ID")}
                      </strong>
                    </p>
                  </div>

                  {/* Tombol Aksi Bawah */}
                  <div className="pt-2.5 border-t border-border/50 flex items-center justify-between gap-2">
                    <button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="text-[11px] text-foreground-secondary hover:text-foreground font-semibold flex items-center gap-1 p-1"
                    >
                      <span>Lihat Nota</span>
                      <ChevronRight size={14} />
                    </button>

                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3.5 py-1.5 bg-primary-soft hover:bg-primary text-primary hover:text-white rounded-pill text-[11px] font-bold transition flex items-center gap-1.5 active:scale-95"
                    >
                      <RotateCcw size={12} />
                      Pesan Lagi
                    </button>
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