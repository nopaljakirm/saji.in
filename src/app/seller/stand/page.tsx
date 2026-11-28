"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useStandStore } from "@/stores/standStore";
import BottomNav from "@/components/layout/BottomNav";
import {
  Store,
  Clock,
  Bell,
  Users,
  Power,
  Calendar,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Sliders,
} from "lucide-react";

export default function SellerStandPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { currentUser, logout } = useAuthStore();
  const { stands, toggleStandOpen, updateStandSettings } = useStandStore();

  const [maxQueue, setMaxQueue] = useState(15);
  const [estimatedTime, setEstimatedTime] = useState("10 - 15 mnt");

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
        <span className="text-xs text-foreground-secondary">Memuat Pengaturan Stand...</span>
      </div>
    );
  }

  const currentStand = stands.find((s) => s.id === (currentUser.standId || "stand-1")) || stands[0];

  const handleToggleOpen = () => {
    toggleStandOpen(currentStand.id);
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      <div className="flex-1 pb-6 overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="p-4 bg-surface border-b border-border sticky top-0 z-20 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-status-success uppercase tracking-wider flex items-center gap-1">
                <Store size={12} /> {currentStand.name}
              </span>
              <h1 className="text-base font-bold text-foreground">Status & Pengaturan Stand</h1>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary-soft text-primary-deep font-bold text-xs flex items-center justify-center">
              BS
            </div>
          </div>
        </header>

        <div className="p-4 space-y-4">
          <p className="text-xs text-foreground-secondary">
            Kontrol visibilitas warung dan penerimaan order dari mahasiswa
          </p>

          {/* Kartu Saklar Status Buka / Tutup Sementara (Persis Figma) */}
          <div
            className={`p-4 rounded-card border shadow-xs transition ${
              currentStand.isOpen
                ? "bg-gradient-to-br from-[#EAF7EF] to-white border-status-success/40"
                : "bg-gradient-to-br from-status-danger-soft to-white border-status-danger/40"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-pill uppercase tracking-wider ${
                    currentStand.isOpen
                      ? "bg-status-success text-white"
                      : "bg-status-danger text-white"
                  }`}
                >
                  {currentStand.isOpen ? "● Buka Menerima Pesanan" : "● Tutup Sementara"}
                </span>

                <h3 className="text-base font-bold text-foreground mt-2">
                  {currentStand.name}
                </h3>
                <p className="text-xs text-foreground-secondary mt-1 max-w-[280px]">
                  {currentStand.isOpen
                    ? "Stand Anda aktif di aplikasi mahasiswa. Pesanan yang masuk akan langsung diteruskan ke Dapur KDS."
                    : "Stand Anda dinonaktifkan sementara di aplikasi mahasiswa. Mahasiswa tidak bisa memesan menu."}
                </p>
              </div>

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  currentStand.isOpen
                    ? "bg-status-success text-white"
                    : "bg-status-danger text-white"
                }`}
              >
                <Power size={20} />
              </div>
            </div>

            <button
              onClick={handleToggleOpen}
              className={`w-full mt-4 py-2.5 text-xs font-bold rounded-pill shadow-xs transition active:scale-98 flex items-center justify-center gap-1.5 ${
                currentStand.isOpen
                  ? "bg-status-warning hover:bg-amber-600 text-white"
                  : "bg-status-success hover:bg-emerald-700 text-white"
              }`}
            >
              {currentStand.isOpen ? (
                <>
                  <AlertCircle size={15} /> Tutup Sementara (Jeda Ramai)
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} /> Buka Kembali Stand Sekarang
                </>
              )}
            </button>
          </div>

          {/* Pengaturan Batas Antrean & Waktu Masak (Persis Figma) */}
          <div className="bg-surface rounded-card border border-border shadow-xs p-4 space-y-3.5">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sliders size={14} className="text-primary" /> Kapasitas & Batas Antrean
            </h4>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-semibold text-foreground">
                  Batas Maksimal Antrean Aktif
                </span>
                <span className="text-xs font-bold font-mono text-primary">{maxQueue} Order</span>
              </div>
              <p className="text-[10px] text-foreground-secondary mb-2">
                Otomatis jeda order masuk saat antrean dapur mencapai batas maksimal.
              </p>
              <input
                type="range"
                min="5"
                max="30"
                value={maxQueue}
                onChange={(e) => setMaxQueue(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            <div className="pt-3 border-t border-border/50">
              <span className="text-[11px] font-semibold text-foreground block mb-1">
                Estimasi Rata-rata Masak
              </span>
              <p className="text-[10px] text-foreground-secondary mb-2">
                Ditampilkan kepada mahasiswa di beranda sebelum memesan.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {["5 - 10 mnt", "10 - 15 mnt", "15 - 20 mnt"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setEstimatedTime(t)}
                    className={`py-1.5 text-xs font-semibold rounded-card border transition ${
                      estimatedTime === t
                        ? "border-primary bg-primary-soft text-primary-deep font-bold"
                        : "border-border text-foreground-secondary hover:bg-background"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Jadwal Operasional (Persis Figma) */}
          <div className="bg-surface rounded-card border border-border shadow-xs p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Calendar size={14} className="text-primary" /> Jadwal Operasional Warung
              </h4>
              <span className="text-[10px] text-status-success font-bold bg-status-success-soft px-2 py-0.5 rounded-pill">
                Otomatis
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 bg-background rounded-card">
                <span className="font-semibold text-foreground">SENIN - JUMAT</span>
                <span className="font-mono text-primary-deep font-bold">07:30 - 16:30 WIB</span>
              </div>
              <div className="flex justify-between p-2 bg-background rounded-card">
                <span className="font-semibold text-foreground-secondary">SABTU - MINGGU</span>
                <span className="text-status-danger font-semibold">Libur / Tutup</span>
              </div>
            </div>
          </div>

          {/* Tombol Logout Stand */}
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-status-danger-soft hover:bg-status-danger/20 text-status-danger text-xs font-bold rounded-pill border border-status-danger/30 transition flex items-center justify-center gap-2"
          >
            <LogOut size={14} />
            <span>Keluar dari Akun Stand</span>
          </button>

          <p className="text-[10px] text-center text-foreground-secondary">
            Saji.in v2.4.0 • ID Stand: FILKOM-STD04
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
