"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useOrderStore } from "@/stores/orderStore";
import { useStandStore } from "@/stores/standStore";
import BottomNav from "@/components/layout/BottomNav";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Store,
  Sparkles,
  ShoppingBag,
  Wallet,
  AlertCircle,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const { items, standId, standName, updateQuantity, removeItem, clearCart, getTotalPrice } =
    useCartStore();
  const { currentUser, deductBalance, topUpBalance } = useAuthStore();
  const { createOrder } = useOrderStore();
  const { stands, decrementStock } = useStandStore();

  const [paymentMethod, setPaymentMethod] = useState<"SAJIPAY" | "QRIS">("SAJIPAY");
  const [isQRISModalOpen, setIsQRISModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessOrder, setPaymentSuccessOrder] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const subtotal = isMounted ? getTotalPrice() : 0;
  const platformFee = 1000; // Biaya platform smart locker
  const finalTotal = subtotal > 0 ? subtotal + platformFee : 0;

  // Cek status buka/tutup stan
  const activeStand = stands.find((s) => s.id === standId);
  const isStandClosed = activeStand ? !activeStand.isOpen : false;

  const currentBalance = currentUser?.balance || 0;
  const isBalanceSufficient = currentBalance >= finalTotal;

  // Tunggu browser siap
  if (!isMounted) {
    return (
      <div className="flex-1 flex flex-col justify-between min-h-screen">
        <header className="p-4 bg-surface border-b border-border flex items-center gap-3">
          <Link href="/" className="p-1 text-foreground-secondary hover:text-foreground">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-foreground text-base">Memuat Keranjang...</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <BottomNav />
      </div>
    );
  }

  // Tampilan jika keranjang kosong
  if (items.length === 0 && !paymentSuccessOrder) {
    return (
      <div className="flex-1 flex flex-col justify-between min-h-screen">
        <header className="p-4 bg-surface border-b border-border flex items-center gap-3">
          <Link href="/" className="p-1 text-foreground-secondary hover:text-foreground">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-foreground text-base">Keranjang Pesanan</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-primary-soft text-primary rounded-full flex items-center justify-center mb-4 shadow-inner">
            <ShoppingBag size={36} />
          </div>
          <h2 className="font-bold text-foreground text-base">Keranjang Masih Kosong</h2>
          <p className="text-foreground-secondary text-xs mt-1.5 max-w-[260px]">
            Kamu belum memilih makanan atau minuman dari stan kantin FILKOM.
          </p>
          <Link
            href="/"
            className="mt-6 px-6 py-2.5 bg-primary hover:bg-primary-deep text-white font-bold text-xs rounded-pill shadow-md transition active:scale-95"
          >
            Pilih Menu Sekarang
          </Link>
        </div>

        <BottomNav />
      </div>
    );
  }

  // Eksekusi Pesanan (Potong Stok & Potong Saldo jika SajiPay)
  const processCheckout = (method: "SAJIPAY" | "QRIS") => {
    if (!currentUser || !standId || !standName) return;

    if (method === "SAJIPAY") {
      if (!isBalanceSufficient) {
        setIsTopUpModalOpen(true);
        return;
      }
      // Potong saldo mahasiswa
      const success = deductBalance(finalTotal);
      if (!success) {
        alert("Saldo SajiPay tidak mencukupi!");
        return;
      }
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      // 1. Kurangi stok menu stan secara atomic & sinkron
      decrementStock(
        items.map((it) => ({
          menuItemId: it.menuItem.id,
          quantity: it.quantity,
        }))
      );

      // 2. Buat pesanan baru ke orderStore (dapur stan yang bersangkutan langsung menerima!)
      const newOrder = createOrder(currentUser, standId, standName, items, finalTotal, method);

      // 3. Kosongkan keranjang
      clearCart();

      // 4. Confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setIsProcessingPayment(false);
      setPaymentSuccessOrder(newOrder.id);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      {/* Konten Scrollable */}
      <div className="flex-1 pb-6 overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="p-4 bg-surface border-b border-border flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-1 text-foreground-secondary hover:text-foreground">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-bold text-foreground text-base">Keranjang Pesanan</h1>
              <p className="text-[11px] text-primary flex items-center gap-1 font-semibold">
                <Store size={12} /> {standName}
              </p>
            </div>
          </div>

          <button
            onClick={clearCart}
            className="text-[11px] text-status-danger font-semibold hover:underline"
          >
            Hapus Semua
          </button>
        </header>

        {/* Peringatan Jika Stan Sedang Tutup Sementara */}
        {isStandClosed && (
          <div className="mx-4 mt-3 p-3 bg-status-danger-soft border border-status-danger/30 rounded-card flex items-center gap-2.5 text-status-danger text-xs font-semibold">
            <AlertCircle size={18} className="shrink-0" />
            <span>
              Stan <strong>{standName}</strong> sedang tutup sementara. Pesanan belum dapat diproses.
            </span>
          </div>
        )}

        {/* Daftar Item Menu di Keranjang */}
        <div className="p-4 space-y-3">
          {items.map((cartItem) => (
            <div
              key={cartItem.menuItem.id}
              className="p-3 bg-surface rounded-card border border-border shadow-xs flex gap-3"
            >
              <img
                src={cartItem.menuItem.image}
                alt={cartItem.menuItem.name}
                className="w-18 h-18 rounded-card object-cover border border-border/50 shrink-0"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-foreground text-xs leading-tight">
                      {cartItem.menuItem.name}
                    </h3>
                    <button
                      onClick={() => removeItem(cartItem.menuItem.id)}
                      className="text-foreground-secondary hover:text-status-danger transition p-0.5"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Kustomisasi / Catatan */}
                  <div className="text-[10px] text-foreground-secondary mt-1 space-y-0.5">
                    {cartItem.selectedHeat && <div>• {cartItem.selectedHeat}</div>}
                    {cartItem.selectedPortion && <div>• {cartItem.selectedPortion}</div>}
                    {cartItem.kitchenNote && (
                      <div className="italic text-primary-deep">
                        Catatan: &ldquo;{cartItem.kitchenNote}&rdquo;
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/40">
                  <span className="font-bold text-xs text-foreground">
                    Rp {(cartItem.menuItem.price * cartItem.quantity).toLocaleString("id-ID")}
                  </span>

                  {/* Stepper Jumlah */}
                  <div className="flex items-center border border-border rounded-pill px-2 py-0.5 gap-2.5 bg-background">
                    <button
                      onClick={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity - 1)}
                      className="text-foreground-secondary hover:text-foreground"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-bold min-w-[14px] text-center">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity + 1)}
                      className="text-foreground-secondary hover:text-foreground"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ringkasan Pembayaran */}
        <div className="mx-4 p-4 bg-surface rounded-card border border-border space-y-2.5 shadow-xs">
          <h4 className="font-bold text-foreground text-xs">Rincian Pembayaran</h4>
          <div className="flex justify-between text-xs text-foreground-secondary">
            <span>Subtotal Menu</span>
            <span className="text-foreground font-semibold">
              Rp {subtotal.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between text-xs text-foreground-secondary">
            <span className="flex items-center gap-1">
              Biaya Layanan Smart Locker
              <Sparkles size={12} className="text-primary" />
            </span>
            <span className="text-foreground font-semibold">
              Rp {platformFee.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="pt-2 border-t border-border flex justify-between text-sm font-bold text-foreground">
            <span>Total Pembayaran</span>
            <span className="text-primary">Rp {finalTotal.toLocaleString("id-ID")}</span>
          </div>
        </div>

        {/* Pilihan Metode Pembayaran (SajiPay vs QRIS) */}
        <div className="mx-4 mt-4 space-y-2.5">
          <h4 className="font-bold text-foreground text-xs">Pilih Metode Pembayaran</h4>

          {/* Opsi 1: SajiPay (Saldo Mahasiswa) */}
          <div
            onClick={() => setPaymentMethod("SAJIPAY")}
            className={`p-3 rounded-card border cursor-pointer transition flex items-center justify-between ${
              paymentMethod === "SAJIPAY"
                ? "bg-primary-soft/40 border-primary shadow-xs"
                : "bg-surface border-border hover:border-border-dark"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                <Wallet size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">SajiPay Mahasiswa</span>
                  {isBalanceSufficient ? (
                    <span className="text-[9px] bg-status-success-soft text-status-success font-bold px-1.5 py-0.2 rounded-pill">
                      Saldo Cukup
                    </span>
                  ) : (
                    <span className="text-[9px] bg-status-danger-soft text-status-danger font-bold px-1.5 py-0.2 rounded-pill">
                      Kurang
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-foreground-secondary font-mono mt-0.5">
                  Saldo: Rp {currentBalance.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isBalanceSufficient && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTopUpModalOpen(true);
                  }}
                  className="text-[10px] text-primary font-bold underline px-1 py-0.5"
                >
                  Top Up
                </button>
              )}
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === "SAJIPAY"
                    ? "border-primary bg-primary text-white"
                    : "border-border"
                }`}
              >
                {paymentMethod === "SAJIPAY" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
          </div>

          {/* Opsi 2: QRIS Dinamis */}
          <div
            onClick={() => setPaymentMethod("QRIS")}
            className={`p-3 rounded-card border cursor-pointer transition flex items-center justify-between ${
              paymentMethod === "QRIS"
                ? "bg-primary-soft/40 border-primary shadow-xs"
                : "bg-surface border-border hover:border-border-dark"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#107C41] text-white flex items-center justify-center shrink-0">
                <QrCode size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-foreground">QRIS Dinamis</span>
                <p className="text-[10px] text-foreground-secondary">
                  BCA, Mandiri, BRI, ShopeePay, GoPay
                </p>
              </div>
            </div>

            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                paymentMethod === "QRIS"
                  ? "border-primary bg-primary text-white"
                  : "border-border"
              }`}
            >
              {paymentMethod === "QRIS" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Tombol Bayar */}
      <div className="p-4 bg-surface border-t border-border flex items-center justify-between gap-4 sticky bottom-16 z-20">
        <div>
          <span className="text-[10px] text-foreground-secondary block">Total Tagihan</span>
          <span className="text-base font-bold text-primary">
            Rp {finalTotal.toLocaleString("id-ID")}
          </span>
        </div>

        {paymentMethod === "SAJIPAY" ? (
          <button
            onClick={() => processCheckout("SAJIPAY")}
            disabled={isStandClosed || isProcessingPayment}
            className={`flex-1 py-3 px-6 text-white font-bold text-xs rounded-pill shadow-md transition active:scale-95 flex items-center justify-center gap-2 ${
              isStandClosed
                ? "bg-foreground-secondary cursor-not-allowed opacity-60"
                : !isBalanceSufficient
                ? "bg-status-warning hover:bg-amber-600"
                : "bg-primary hover:bg-primary-deep"
            }`}
          >
            {isProcessingPayment ? (
              <span>Memproses Pembayaran...</span>
            ) : isStandClosed ? (
              <span>Stan Tutup Sementara</span>
            ) : !isBalanceSufficient ? (
              <span>Top Up & Bayar Saldo</span>
            ) : (
              <>
                <Wallet size={16} />
                Bayar dengan SajiPay
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => setIsQRISModalOpen(true)}
            disabled={isStandClosed || isProcessingPayment}
            className={`flex-1 py-3 px-6 text-white font-bold text-xs rounded-pill shadow-md transition active:scale-95 flex items-center justify-center gap-2 ${
              isStandClosed
                ? "bg-foreground-secondary cursor-not-allowed opacity-60"
                : "bg-primary hover:bg-primary-deep"
            }`}
          >
            <QrCode size={16} />
            Bayar via QRIS
          </button>
        )}
      </div>

      <BottomNav />

      {/* Modal Simulasi QRIS */}
      <AnimatePresence>
        {isQRISModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-[360px] bg-surface rounded-dialog p-5 shadow-2xl border border-border text-center"
            >
              {!paymentSuccessOrder ? (
                <>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                    <span className="text-xs font-bold text-foreground">Pembayaran QRIS</span>
                    <span className="text-[10px] bg-status-warning-soft text-status-warning font-bold px-2 py-0.5 rounded-pill">
                      04:59
                    </span>
                  </div>

                  <p className="text-xs text-foreground-secondary mb-3">
                    Scan QRIS ini menggunakan m-Banking atau e-Wallet kamu
                  </p>

                  <div className="p-4 bg-white rounded-card border-2 border-dashed border-primary/40 inline-block shadow-inner mb-3">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=SAJIIN-FILKOM-PAYMENT"
                      alt="QR Code QRIS"
                      className="w-40 h-40 object-contain mx-auto"
                    />
                  </div>

                  <div className="bg-background p-2.5 rounded-card text-center mb-4">
                    <span className="text-[10px] text-foreground-secondary block">Total Bayar:</span>
                    <span className="text-base font-bold text-primary">
                      Rp {finalTotal.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => processCheckout("QRIS")}
                      disabled={isProcessingPayment}
                      className="w-full py-2.5 bg-status-success hover:bg-emerald-700 text-white font-bold text-xs rounded-pill shadow-md transition flex items-center justify-center gap-2"
                    >
                      {isProcessingPayment ? (
                        <span>Memverifikasi Pembayaran...</span>
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          Simulasi Bayar Berhasil
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setIsQRISModalOpen(false)}
                      disabled={isProcessingPayment}
                      className="w-full py-2 text-foreground-secondary hover:text-foreground text-xs font-semibold"
                    >
                      Batal / Kembali
                    </button>
                  </div>
                </>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Quick Top Up SajiPay */}
      <AnimatePresence>
        {isTopUpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-[360px] bg-surface rounded-dialog p-5 shadow-2xl border border-border"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-primary" />
                  <h3 className="font-bold text-foreground text-sm">Top Up SajiPay Cepat</h3>
                </div>
                <button
                  onClick={() => setIsTopUpModalOpen(false)}
                  className="text-foreground-secondary hover:text-foreground text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="my-4 space-y-3">
                <p className="text-xs text-foreground-secondary">
                  Saldo kamu saat ini <strong>Rp {currentBalance.toLocaleString("id-ID")}</strong>. Pilih
                  nominal isi ulang untuk melanjutkan pesanan:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {[20000, 50000, 100000, 150000].map((nominal) => (
                    <button
                      key={nominal}
                      onClick={() => {
                        topUpBalance(nominal);
                        confetti({ particleCount: 40, spread: 45 });
                        setIsTopUpModalOpen(false);
                      }}
                      className="py-2.5 px-3 bg-primary-soft/50 hover:bg-primary hover:text-white border border-primary/20 rounded-card font-bold text-xs text-primary transition"
                    >
                      +Rp {nominal.toLocaleString("id-ID")}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setIsTopUpModalOpen(false);
                  router.push("/profile");
                }}
                className="w-full py-2 text-center text-xs text-foreground-secondary hover:text-primary font-semibold"
              >
                Atau buka Halaman Profil Lengkap →
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tampilan Layar Sukses Bayar */}
      <AnimatePresence>
        {paymentSuccessOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-[360px] bg-surface rounded-dialog p-5 shadow-2xl border border-border text-center py-6 space-y-3"
            >
              <div className="w-16 h-16 bg-status-success-soft text-status-success rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-base font-bold text-foreground">Pembayaran Berhasil!</h3>
              <p className="text-xs text-foreground-secondary">
                Pesananmu telah diteruskan ke dapur stan <strong>{standName}</strong> dengan nomor
                antrean:
              </p>
              <div className="p-3 bg-primary-soft rounded-card font-mono font-bold text-primary-deep text-lg">
                {paymentSuccessOrder}
              </div>

              <button
                onClick={() => {
                  router.push(`/orders/${paymentSuccessOrder}`);
                }}
                className="w-full mt-4 py-3 bg-primary hover:bg-primary-deep text-white font-bold text-xs rounded-pill shadow-md transition"
              >
                Pantau Pesanan di Dapur & Rak →
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
