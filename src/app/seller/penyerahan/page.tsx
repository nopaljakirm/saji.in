"use client";

import { useState, useEffect } from "react";
import { useOrderStore } from "@/stores/orderStore";
import BottomNav from "@/components/layout/BottomNav";
import RoleSwitcherPill from "@/components/layout/RoleSwitcherPill";
import {
  PackageCheck,
  Search,
  KeyRound,
  CheckCircle2,
  Box,
  AlertCircle,
} from "lucide-react";

export default function SellerPenyerahanPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const { orders, updateOrderStatus, verifyPickupPin } = useOrderStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const rackOrders = orders.filter((o) => o.status === "READY_IN_RACK");

  // Handler Verifikasi Pengambilan Mahasiswa
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    // Cek apakah input berupa PIN 4 digit atau ID Pesanan (KTN-xxxx)
    const targetOrder = orders.find(
      (o) =>
        (o.pickupPin === inputCode.trim() || o.id.toLowerCase() === inputCode.trim().toLowerCase()) &&
        o.status === "READY_IN_RACK"
    );

    if (targetOrder) {
      updateOrderStatus(targetOrder.id, "COMPLETED");
      setVerificationResult({
        success: true,
        message: `Pesanan ${targetOrder.id} (${targetOrder.buyerName}) berhasil diserahkan!`,
      });
      setInputCode("");
    } else {
      setVerificationResult({
        success: false,
        message: "PIN atau Nomor Pesanan tidak cocok dengan makanan di rak!",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      <div className="flex-1 pb-6 overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="p-4 bg-surface border-b border-border sticky top-0 z-20">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-bold text-status-success uppercase tracking-wider">
                Smart Locker Management
              </span>
              <h1 className="text-base font-bold text-foreground">
                Verifikasi Penyerahan
              </h1>
            </div>
            <RoleSwitcherPill />
          </div>
        </header>

        <div className="p-4 space-y-5">
          {/* Form Input Verifikasi PIN Mahasiswa */}
          <div className="p-4 bg-surface rounded-card border border-border shadow-xs">
            <h2 className="text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
              <KeyRound size={14} className="text-primary" /> Input PIN / Scan Kode Pesanan
            </h2>
            <p className="text-[11px] text-foreground-secondary mb-3">
              Ketik 4 digit PIN mahasiswa atau kode antrean untuk mengonfirmasi pengambilan makanan:
            </p>

            <form onSubmit={handleVerify} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Contoh: 5821 atau KTN-0231"
                  className="w-full px-3 py-2.5 text-sm font-mono uppercase bg-background rounded-card border border-border focus:outline-none focus:border-primary tracking-wider"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary hover:bg-primary-deep text-white font-bold text-xs rounded-pill shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <PackageCheck size={16} /> Verifikasi & Buka Kunci
              </button>
            </form>

            {/* Alert Hasil Verifikasi */}
            {verificationResult && (
              <div
                className={`mt-3 p-3 rounded-card text-xs flex items-center gap-2 ${
                  verificationResult.success
                    ? "bg-status-success-soft text-status-success border border-status-success/30 font-medium"
                    : "bg-status-danger-soft text-status-danger border border-status-danger/30 font-medium"
                }`}
              >
                {verificationResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{verificationResult.message}</span>
              </div>
            )}
          </div>

          {/* Inventaris Slot Rak Cerdas Saat Ini */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Box size={14} className="text-primary" /> Makanan di Rak Cerdas Saat Ini
              </h3>
              <span className="text-[11px] font-semibold text-status-success">
                {rackOrders.length} Slot Terisi
              </span>
            </div>

            {rackOrders.length === 0 ? (
              <div className="p-6 text-center bg-surface rounded-card border border-border text-foreground-secondary text-xs">
                Tidak ada makanan yang sedang menunggu di rak.
              </div>
            ) : (
              <div className="space-y-2.5">
                {rackOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3 bg-surface rounded-card border border-border shadow-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-status-success">
                          {order.rackSlot}
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {order.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-foreground-secondary mt-0.5">
                        {order.buyerName} • PIN: <strong className="font-mono">{order.pickupPin}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => updateOrderStatus(order.id, "COMPLETED")}
                      className="px-3 py-1 bg-status-success-soft hover:bg-status-success hover:text-white text-status-success font-bold text-[11px] rounded-pill border border-status-success/30 transition"
                    >
                      Serahkan
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}