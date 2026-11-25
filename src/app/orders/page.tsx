"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useOrderStore } from "@/stores/orderStore";
import BottomNav from "@/components/layout/BottomNav";
import StatusBadge from "@/components/ui/StatusBadge";
import { ArrowLeft, Clock, ChevronRight, Store, Box, ShoppingBag } from "lucide-react";

export default function OrdersListPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { currentUser } = useAuthStore();
  const { getOrdersByBuyer } = useOrderStore();

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
          <h1 className="font-bold text-foreground text-base">Pesanan Saya</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <BottomNav />
      </div>
    );
  }

  const buyerOrders = currentUser ? getOrdersByBuyer(currentUser.id) : [];
  const activeOrders = buyerOrders.filter((o) => o.status === "COOKING" || o.status === "READY_IN_RACK");
  const pastOrders = buyerOrders.filter((o) => o.status === "COMPLETED" || o.status === "CANCELLED");

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      <div className="flex-1 pb-6 overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="p-4 bg-surface border-b border-border flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-1 text-foreground-secondary hover:text-foreground">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-bold text-foreground text-base">Pesanan Saya</h1>
          </div>
          <span className="text-xs font-semibold text-primary">{activeOrders.length} Aktif</span>
        </header>

        {buyerOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center mt-12">
            <div className="w-16 h-16 bg-primary-soft text-primary rounded-full flex items-center justify-center mb-3">
              <ShoppingBag size={30} />
            </div>
            <h3 className="font-bold text-foreground text-sm">Belum Ada Pesanan</h3>
            <p className="text-foreground-secondary text-xs mt-1 max-w-[220px]">
              Pesanan yang kamu buat di kantin FILKOM akan muncul di sini.
            </p>
            <Link
              href="/"
              className="mt-4 px-5 py-2 bg-primary text-white text-xs font-bold rounded-pill shadow-sm"
            >
              Pesan Menu Sekarang
            </Link>
          </div>
        ) : (
          <div className="p-4 space-y-5">
            {/* Bagian Pesanan Aktif */}
            {activeOrders.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-foreground mb-2.5 flex items-center gap-1.5">
                  <Clock size={14} className="text-primary" /> Pesanan Sedang Diproses
                </h2>

                <div className="space-y-3">
                  {activeOrders.map((order) => {
                    const isReady = order.status === "READY_IN_RACK";
                    return (
                      <div
                        key={order.id}
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className={`p-4 rounded-card border transition cursor-pointer shadow-xs ${
                          isReady
                            ? "bg-status-success-soft/40 border-status-success/30 hover:border-status-success"
                            : "bg-surface border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2 pb-2 border-b border-border/50">
                          <div>
                            <span className="text-xs font-bold text-foreground font-mono">
                              {order.id}
                            </span>
                            <p className="text-[11px] text-foreground-secondary flex items-center gap-1 mt-0.5">
                              <Store size={12} /> {order.standName}
                            </p>
                          </div>
                          <StatusBadge status={order.status} size="sm" />
                        </div>

                        {/* Ringkasan Item */}
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

                        {/* Banner Khusus jika Siap di Rak */}
                        {isReady && (
                          <div className="p-2.5 bg-status-success-soft rounded-card border border-status-success/20 mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-status-success">
                              <Box size={16} />
                              <span className="text-xs font-bold">Ambil di: {order.rackSlot}</span>
                            </div>
                            <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded text-status-success font-bold border border-status-success/20">
                              PIN: {order.pickupPin}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                          <span className="text-foreground-secondary text-[11px]">Total Pembayaran</span>
                          <div className="flex items-center gap-1 text-primary font-bold">
                            <span>Rp {order.totalPrice.toLocaleString("id-ID")}</span>
                            <ChevronRight size={14} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bagian Riwayat Pesanan Selesai */}
            {pastOrders.length > 0 && (
              <div>
                <h2 className="text-xs font-bold text-foreground-secondary mb-2.5">Pesanan Selesai</h2>
                <div className="space-y-2.5">
                  {pastOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="p-3 bg-surface rounded-card border border-border shadow-xs cursor-pointer hover:border-foreground/20 transition flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-foreground">{order.id}</span>
                          <StatusBadge status={order.status} size="sm" />
                        </div>
                        <p className="text-[11px] text-foreground-secondary mt-0.5">
                          {order.standName} • {order.items.length} Menu
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-foreground">
                          Rp {order.totalPrice.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[10px] text-foreground-secondary block">
                          {order.createdAt}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}