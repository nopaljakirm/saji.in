"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import BottomNav from "@/components/layout/BottomNav";
import confetti from "canvas-confetti";
import {
  Wallet,
  Plus,
  Bell,
  ShieldAlert,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  CheckCircle2,
  X,
  Sparkles,
  CreditCard,
  Building,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { currentUser, topUpBalance, logout, updateAllergies } = useAuthStore();

  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [selectedTopUpAmount, setSelectedTopUpAmount] = useState<number>(20000);
  const [selectedBank, setSelectedBank] = useState<string>("BCA");
  const [isAllergyModalOpen, setIsAllergyModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
        <span className="text-xs text-foreground-secondary">Memuat Profil...</span>
      </div>
    );
  }

  // Jika belum login, arahkan ke login
  if (!currentUser) {
    router.push("/login");
    return null;
  }

  const handleTopUpSubmit = () => {
    topUpBalance(selectedTopUpAmount);
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
    setIsTopUpOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const allergyOptions = ["Kacang", "Seafood / Udang", "Telur", "Susu Sapi", "Gluten / Terigu", "Pedas Ekstrem"];

  const toggleAllergy = (allergy: string) => {
    const current = currentUser.allergies || [];
    if (current.includes(allergy)) {
      updateAllergies(current.filter((a) => a !== allergy));
    } else {
      updateAllergies([...current, allergy]);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      <div className="flex-1 pb-6 overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="p-4 bg-surface border-b border-border sticky top-0 z-20">
          <h1 className="font-bold text-foreground text-base">Profil Pengguna</h1>
          <p className="text-[11px] text-foreground-secondary">Akun Mahasiswa Terdaftar FILKOM UB</p>
        </header>

        <div className="p-4 space-y-4">
          {/* Kartu Identitas Mahasiswa (Persis Figma) */}
          <div className="p-4 bg-surface rounded-card border border-border shadow-xs flex items-center gap-3.5">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-deep text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>

            <div className="flex-1">
              <h2 className="text-sm font-bold text-foreground leading-tight">
                {currentUser.name}
              </h2>
              <p className="text-[11px] text-foreground-secondary mt-0.5 font-mono">
                NIM: {currentUser.nim || "225150200111"} • {currentUser.faculty || "FILKOM UB"}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[9px] bg-primary-soft text-primary-deep font-bold px-2 py-0.5 rounded-pill">
                  Mahasiswa Aktif
                </span>
                <span className="text-[9px] bg-status-success-soft text-status-success font-bold px-2 py-0.5 rounded-pill flex items-center gap-1">
                  <CheckCircle2 size={10} /> Terverifikasi
                </span>
              </div>
            </div>
          </div>

          {/* Kartu Dompet SajiPay Mahasiswa (Persis Figma) */}
          <div className="p-4 bg-gradient-to-br from-primary-deep to-primary text-white rounded-card shadow-md relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-semibold opacity-90 flex items-center gap-1">
                  <Wallet size={12} /> Saldo SajiPay Mahasiswa
                </span>
                <h3 className="text-2xl font-black mt-1 font-mono">
                  Rp {(currentUser.balance || 0).toLocaleString("id-ID")}
                </h3>
                <p className="text-[10px] opacity-80 mt-1">
                  Bebas biaya admin antar kantin FILKOM
                </p>
              </div>

              <button
                onClick={() => setIsTopUpOpen(true)}
                className="px-3.5 py-1.5 bg-white text-primary hover:bg-white/90 text-xs font-bold rounded-pill shadow-xs transition active:scale-95 flex items-center gap-1"
              >
                <Plus size={14} /> Top Up
              </button>
            </div>
          </div>

          {/* Pengaturan Akun & Preferensi (Persis Figma) */}
          <div className="bg-surface rounded-card border border-border shadow-xs overflow-hidden">
            <div className="p-3.5 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-primary" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">Notifikasi Pesanan & Pickup</h4>
                  <p className="text-[10px] text-foreground-secondary">Alert saat makanan siap di rak</p>
                </div>
              </div>
              <span className="text-[10px] bg-status-success-soft text-status-success font-bold px-2 py-0.5 rounded-pill">
                Aktif
              </span>
            </div>

            <div
              onClick={() => setIsAllergyModalOpen(true)}
              className="p-3.5 border-b border-border/50 flex items-center justify-between cursor-pointer hover:bg-background transition"
            >
              <div className="flex items-center gap-3">
                <ShieldAlert size={16} className="text-[#D99A00]" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">Preferensi Alergi & Pantangan</h4>
                  <p className="text-[10px] text-foreground-secondary">
                    {currentUser.allergies && currentUser.allergies.length > 0
                      ? `${currentUser.allergies.length} alergen dipilih (${currentUser.allergies.join(", ")})`
                      : "Belum diatur"}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-foreground-secondary" />
            </div>

            <div className="p-3.5 border-b border-border/50 flex items-center justify-between cursor-pointer hover:bg-background transition">
              <div className="flex items-center gap-3">
                <HelpCircle size={16} className="text-primary" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">Pusat Bantuan & Komplain Stand</h4>
                  <p className="text-[10px] text-foreground-secondary">Kendala pesanan atau loker cerdas</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-foreground-secondary" />
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info size={16} className="text-foreground-secondary" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">Tentang Kantin Cerdas FILKOM</h4>
                  <p className="text-[10px] text-foreground-secondary">Saji.in v2.4.0 • FILKOM UB</p>
                </div>
              </div>
              <span className="text-[10px] text-foreground-secondary font-mono">v2.4.0</span>
            </div>
          </div>

          {/* Tombol Keluar dari Akun */}
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-status-danger-soft hover:bg-status-danger/20 text-status-danger text-xs font-bold rounded-pill border border-status-danger/30 transition flex items-center justify-center gap-2"
          >
            <LogOut size={14} />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>

      <BottomNav />

      {/* Modal Top Up SajiPay */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-[360px] bg-surface rounded-dialog p-5 shadow-2xl border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Wallet size={16} className="text-primary" /> Top Up SajiPay
              </h3>
              <button
                onClick={() => setIsTopUpOpen(false)}
                className="p-1 rounded-full text-foreground-secondary hover:bg-background"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-[11px] text-foreground-secondary mb-3">
              Pilih nominal saldo yang ingin kamu tambahkan ke akun mahasiswa:
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[10000, 20000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSelectedTopUpAmount(amt)}
                  className={`p-2.5 rounded-card border text-xs font-bold font-mono transition ${
                    selectedTopUpAmount === amt
                      ? "border-primary bg-primary-soft text-primary-deep"
                      : "border-border text-foreground hover:bg-background"
                  }`}
                >
                  Rp {amt.toLocaleString("id-ID")}
                </button>
              ))}
            </div>

            <label className="text-[11px] font-bold text-foreground block mb-1">
              Metode Transfer Bank / VA
            </label>
            <div className="space-y-1.5 mb-4">
              {["BCA Virtual Account", "Mandiri Livin", "BRImo", "QRIS Instant"].map((method) => (
                <div
                  key={method}
                  onClick={() => setSelectedBank(method)}
                  className={`p-2 rounded-card border text-xs flex items-center justify-between cursor-pointer transition ${
                    selectedBank === method
                      ? "border-primary bg-primary-soft text-primary-deep font-semibold"
                      : "border-border text-foreground-secondary hover:bg-background"
                  }`}
                >
                  <span>{method}</span>
                  {selectedBank === method && <CheckCircle2 size={14} className="text-primary" />}
                </div>
              ))}
            </div>

            <button
              onClick={handleTopUpSubmit}
              className="w-full py-2.5 bg-primary hover:bg-primary-deep text-white font-bold text-xs rounded-pill shadow-md transition"
            >
              Konfirmasi Top Up Rp {selectedTopUpAmount.toLocaleString("id-ID")}
            </button>
          </div>
        </div>
      )}

      {/* Modal Preferensi Alergi */}
      {isAllergyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-[360px] bg-surface rounded-dialog p-5 shadow-2xl border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <ShieldAlert size={16} className="text-[#D99A00]" /> Preferensi Alergi
              </h3>
              <button
                onClick={() => setIsAllergyModalOpen(false)}
                className="p-1 rounded-full text-foreground-secondary hover:bg-background"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-[11px] text-foreground-secondary mb-3">
              Tandai bahan yang memicu alergi agar sistem memberi peringatan saat kamu memilih menu:
            </p>

            <div className="space-y-2 mb-4">
              {allergyOptions.map((alg) => {
                const isSelected = (currentUser.allergies || []).includes(alg);
                return (
                  <button
                    key={alg}
                    onClick={() => toggleAllergy(alg)}
                    className={`w-full p-2.5 rounded-card border text-left text-xs flex items-center justify-between transition ${
                      isSelected
                        ? "border-status-danger bg-status-danger-soft text-status-danger font-semibold"
                        : "border-border text-foreground hover:bg-background"
                    }`}
                  >
                    <span>{alg}</span>
                    {isSelected && <CheckCircle2 size={14} className="text-status-danger" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsAllergyModalOpen(false)}
              className="w-full py-2.5 bg-primary hover:bg-primary-deep text-white font-bold text-xs rounded-pill shadow-xs transition"
            >
              Simpan Preferensi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
