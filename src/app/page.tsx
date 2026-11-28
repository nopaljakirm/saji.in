"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MenuItem, Stand } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { useStandStore } from "@/stores/standStore";
import BottomNav from "@/components/layout/BottomNav";
import ActiveOrderPill from "@/components/buyer/ActiveOrderPill";
import MenuCustomizeModal from "@/components/buyer/MenuCustomizeModal";
import {
  MapPin,
  Search,
  Plus,
  Sparkles,
  UtensilsCrossed,
  Wallet,
  AlertCircle,
  Store,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { currentUser, buyerUser, isHydrated } = useAuthStore();
  const { stands, menuItems } = useStandStore();

  const [selectedStandId, setSelectedStandId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMenuToCustomize, setSelectedMenuToCustomize] = useState<{
    item: MenuItem;
    standName: string;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Mahasiswa session yang aktif
  const activeBuyer = buyerUser || (currentUser?.role === "BUYER" ? currentUser : null);

  // PROTEKSI RUTE & PENGALIHAN DI DALAM useEffect (Mencegah Loop & Error Render)
  useEffect(() => {
    if (isMounted && isHydrated) {
      if (!activeBuyer && !currentUser) {
        router.replace("/login");
      } else if (currentUser?.role === "SELLER" && !activeBuyer) {
        router.replace("/seller/ringkasan");
      }
    }
  }, [isMounted, isHydrated, currentUser, activeBuyer, router]);

  // Tunggu sampai browser siap atau selama proses pengalihan
  if (!isMounted || !isHydrated || (!activeBuyer && (!currentUser || currentUser.role === "SELLER"))) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
        <span className="text-xs text-foreground-secondary">Menyiapkan Saji.in...</span>
      </div>
    );
  }

  // Filter Stan & Menu
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesStand = selectedStandId === "all" || item.standId === selectedStandId;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStand && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      <div className="flex-1 pb-6 overflow-y-auto no-scrollbar">
        {/* Header App Mahasiswa */}
        <header className="p-4 bg-surface border-b border-border sticky top-0 z-20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                <MapPin size={12} />
                <span>Kantin Gedung F • FILKOM UB</span>
              </div>
              <h1 className="text-base font-bold text-foreground mt-0.5">
                Halo, {currentUser?.name?.split(" ")[0] || "Mahasiswa"} 👋
              </h1>
            </div>

            {/* Pill Saldo SajiPay (Klik untuk langsung ke Profil/TopUp) */}
            <Link
              href="/profile"
              className="bg-primary-soft border border-primary/20 px-3 py-1.5 rounded-pill shadow-xs flex items-center gap-1.5 hover:bg-primary-soft/80 transition"
              title="Saldo SajiPay Mahasiswa"
            >
              <Wallet size={14} className="text-primary" />
              <div className="text-right">
                <span className="text-[11px] font-bold text-primary-deep block leading-tight font-mono">
                  Rp {(currentUser?.balance || 0).toLocaleString("id-ID")}
                </span>
              </div>
            </Link>
          </div>

          {/* Kolom Pencarian */}
          <div className="relative mt-2">
            <Search className="absolute left-3.5 top-3 text-foreground-secondary" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Mau makan apa di kantin hari ini?"
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-background rounded-pill border border-border focus:outline-none focus:border-primary transition"
            />
          </div>
        </header>

        {/* Banner Smart Canteen */}
        <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-primary to-primary-deep rounded-card text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-[70%]">
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-pill mb-1.5">
              <Sparkles size={10} /> Smart Locker Ready
            </span>
            <h2 className="text-sm font-bold leading-snug">Pesan & Bayar QRIS, Ambil di Rak Tanpa Antre!</h2>
          </div>
          <UtensilsCrossed
            className="absolute -right-3 -bottom-3 text-white/15 rotate-12"
            size={100}
          />
        </div>

        {/* Pilihan Stan Kantin FILKOM (Pemisahan Stand yang Jelas) */}
        <div className="mt-5">
          <div className="px-4 flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-foreground text-sm">Pilihan Stan Kantin</h3>
              <p className="text-[11px] text-foreground-secondary">
                Pilih stan untuk melihat menu khusus stan tersebut
              </p>
            </div>
            {selectedStandId !== "all" ? (
              <button
                onClick={() => setSelectedStandId("all")}
                className="text-[11px] text-primary font-bold hover:underline"
              >
                Lihat Semua
              </button>
            ) : (
              <span className="text-[11px] text-foreground-secondary font-medium">
                {stands.filter((s) => s.isOpen).length} Stan Buka
              </span>
            )}
          </div>

          {/* Kartu Visual Stan (Horizontal Scroll Card) */}
          <div className="flex gap-3 overflow-x-auto px-4 no-scrollbar pb-2">
            {/* Tombol Opsi Semua Stan */}
            <button
              onClick={() => setSelectedStandId("all")}
              className={`flex flex-col items-center justify-center p-3 rounded-card border transition shrink-0 w-24 text-center ${
                selectedStandId === "all"
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-surface border-border text-foreground hover:bg-background"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 ${
                  selectedStandId === "all" ? "bg-white/20 text-white" : "bg-primary-soft text-primary"
                }`}
              >
                <UtensilsCrossed size={18} />
              </div>
              <span className="text-xs font-bold leading-tight">Semua</span>
              <span className="text-[10px] opacity-80 mt-0.5">Semua Stan</span>
            </button>

            {/* Kartu Tiap Stan Kantin */}
            {stands.map((stand) => {
              const isSelected = selectedStandId === stand.id;
              return (
                <div
                  key={stand.id}
                  onClick={() => setSelectedStandId(stand.id)}
                  className={`p-2.5 rounded-card border transition shrink-0 w-44 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? "bg-primary-soft/40 border-primary shadow-md ring-1 ring-primary"
                      : "bg-surface border-border hover:border-primary/40 shadow-xs"
                  } ${!stand.isOpen ? "opacity-65" : ""}`}
                >
                  <div className="relative">
                    <img
                      src={stand.image}
                      alt={stand.name}
                      className="w-full h-20 object-cover rounded-card mb-2 border border-border/50"
                    />
                    {/* Badge Status Buka / Tutup */}
                    <span
                      className={`absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-pill shadow-xs ${
                        stand.isOpen
                          ? "bg-status-success text-white"
                          : "bg-status-danger text-white"
                      }`}
                    >
                      {stand.isOpen ? "Buka" : "Tutup"}
                    </span>

                    {/* Rating Bintang */}
                    <span className="absolute bottom-3 right-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-pill flex items-center gap-0.5">
                      ★ {stand.rating}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground text-xs line-clamp-1 leading-snug">
                      {stand.name}
                    </h4>
                    <p className="text-[10px] text-foreground-secondary line-clamp-1 mt-0.5">
                      {stand.location}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-foreground-secondary mt-2 pt-1.5 border-t border-border/40">
                      <span>⏱ {stand.estimatedTime}</span>
                      <span className="text-primary font-semibold">
                        {stand.queueLength} antrean
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Banner Filter Stan Aktif (Menegaskan Stan yang Sedang Dilihat) */}
        {selectedStandId !== "all" && (
          <div className="mx-4 mt-3 p-3 bg-primary-soft/70 border border-primary/30 rounded-card flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                <Store size={15} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary block leading-tight">
                  SEDANG MELIHAT MENU STAN:
                </span>
                <span className="text-xs font-bold text-foreground">
                  {stands.find((s) => s.id === selectedStandId)?.name}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedStandId("all")}
              className="text-[11px] font-bold bg-white text-primary px-2.5 py-1 rounded-pill border border-primary/20 shadow-xs hover:bg-primary hover:text-white transition"
            >
              Tampilkan Semua
            </button>
          </div>
        )}

        {/* Katalog Menu Makanan & Minuman */}
        <div className="mt-5 px-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground text-sm">
              {selectedStandId === "all"
                ? "Daftar Menu Kantin"
                : `Menu di ${stands.find((s) => s.id === selectedStandId)?.name}`}
            </h3>
            <span className="text-xs text-foreground-secondary font-medium">
              {filteredMenuItems.length} Menu
            </span>
          </div>

          <div className="space-y-3">
            {filteredMenuItems.map((item) => {
              const stand = stands.find((s) => s.id === item.standId);
              const isStandClosed = stand ? !stand.isOpen : false;
              const isOutOfStock =
                item.stockStatus === "HABIS" ||
                (item.stockCount !== undefined && item.stockCount <= 0);
              const isAlmostEmpty = item.stockStatus === "HAMPIR_HABIS" && (item.stockCount ?? 0) > 0;

              return (
                <div
                  key={item.id}
                  className={`p-3 bg-surface rounded-card border shadow-xs flex gap-3 transition ${
                    isStandClosed || isOutOfStock
                      ? "opacity-65 border-border bg-background/50"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-22 h-22 rounded-card object-cover border border-border/50"
                    />
                    {isStandClosed && (
                      <span className="absolute inset-0 bg-black/50 backdrop-blur-xs rounded-card flex items-center justify-center text-[10px] text-white font-bold text-center px-1">
                        Stan Tutup
                      </span>
                    )}
                    {!isStandClosed && isOutOfStock && (
                      <span className="absolute inset-0 bg-black/50 backdrop-blur-xs rounded-card flex items-center justify-center text-[10px] text-white font-bold text-center px-1">
                        Habis
                      </span>
                    )}
                    {!isStandClosed && isAlmostEmpty && (
                      <span className="absolute bottom-1 left-1 right-1 bg-status-danger text-white text-[9px] font-bold py-0.5 rounded-pill text-center shadow-xs">
                        Sisa {item.stockCount} Porsi
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-foreground text-xs leading-snug">
                          {item.name}
                        </h4>
                        {item.isPopular && !isStandClosed && (
                          <span className="bg-primary-soft text-primary-deep text-[9px] font-bold px-1.5 py-0.5 rounded-pill shrink-0">
                            Favorit
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-foreground-secondary line-clamp-1 mt-0.5">
                        {item.description}
                      </p>

                      <p className="text-[10px] text-primary-deep font-semibold mt-1">
                        {stand?.name}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                      <span className="font-bold text-xs text-foreground">
                        Rp {item.price.toLocaleString("id-ID")}
                      </span>

                      {isStandClosed ? (
                        <span className="text-[10px] text-status-danger font-semibold flex items-center gap-1">
                          <AlertCircle size={11} /> Stan Tutup
                        </span>
                      ) : isOutOfStock ? (
                        <span className="text-[10px] text-foreground-secondary font-semibold">
                          Stok Habis
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            setSelectedMenuToCustomize({
                              item,
                              standName: stand?.name || "Kantin FILKOM",
                            })
                          }
                          className="px-3 py-1 bg-primary-soft hover:bg-primary text-primary hover:text-white rounded-pill text-[11px] font-bold transition flex items-center gap-1 active:scale-95"
                        >
                          <Plus size={12} />
                          Tambah
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Floating Banner Pesanan Aktif & Bottom Navigation */}
      <div className="sticky bottom-0 z-30 bg-background/80 backdrop-blur-md pt-2">
        <ActiveOrderPill />
        <BottomNav />
      </div>

      {/* Modal Kustomisasi Menu (Bottom Sheet) */}
      <MenuCustomizeModal
        isOpen={!!selectedMenuToCustomize}
        item={selectedMenuToCustomize?.item || null}
        standName={selectedMenuToCustomize?.standName || ""}
        onClose={() => setSelectedMenuToCustomize(null)}
      />
    </div>
  );
}
