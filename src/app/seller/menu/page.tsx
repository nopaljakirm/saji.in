"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useStandStore, ExtendedMenuItem } from "@/stores/standStore";
import BottomNav from "@/components/layout/BottomNav";
import {
  UtensilsCrossed,
  Plus,
  Search,
  Store,
  Edit3,
  X,
  Check,
  AlertTriangle,
  Trash2,
} from "lucide-react";

export default function SellerMenuPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { currentUser, sellerUser, isHydrated, switchSellerStand } = useAuthStore();
  const { menuItems, stands, addMenuItem, updateMenuItem, deleteMenuItem } = useStandStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");

  // State Modal Tambah Menu
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState(15000);
  const [newCategory, setNewCategory] = useState<"Makanan" | "Minuman" | "Camilan">("Makanan");
  const [newDesc, setNewDesc] = useState("");
  const [newStock, setNewStock] = useState(30);

  // State Modal Edit Menu
  const [editingItem, setEditingItem] = useState<ExtendedMenuItem | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeSeller = sellerUser || (currentUser?.role === "SELLER" ? currentUser : null);

  // Proteksi di dalam useEffect
  useEffect(() => {
    if (isMounted && isHydrated && !activeSeller) {
      router.replace("/login");
    }
  }, [isMounted, isHydrated, activeSeller, router]);

  if (!isMounted || !isHydrated || !activeSeller) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
        <span className="text-xs text-foreground-secondary">Memuat Menu Stand...</span>
      </div>
    );
  }

  const currentStand = stands.find((s) => s.id === (activeSeller.standId || "stand-1")) || stands[0];

  const filtered = menuItems.filter((m) => {
    const matchesStand = m.standId === currentStand.id;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "Semua" || m.category === categoryFilter;
    return matchesStand && matchesSearch && matchesCat;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newItem: ExtendedMenuItem = {
      id: `menu-${Date.now()}`,
      standId: currentStand.id,
      name: newName,
      price: Number(newPrice),
      category: newCategory,
      description: newDesc || "Menu lezat buatan stan",
      image:
        newCategory === "Minuman"
          ? "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80"
          : "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80",
      isAvailable: true,
      stockCount: Number(newStock),
      stockMax: Number(newStock),
      stockStatus: "AMAN",
      heatOptions: newCategory === "Makanan" ? ["Level 0 (Tidak Pedas)", "Level 1 (Sedang)", "Level 2 (Pedas)"] : ["Dingin", "Hangat"],
      portionOptions: ["Porsi Standar", "Porsi Kenyang (+Rp 3.000)"],
    };

    addMenuItem(newItem);
    setIsAddModalOpen(false);
    setNewName("");
    setNewDesc("");
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    updateMenuItem(editingItem.id, {
      name: editingItem.name,
      price: Number(editingItem.price),
      stockCount: Number(editingItem.stockCount),
      stockStatus:
        editingItem.stockCount === 0
          ? "HABIS"
          : (editingItem.stockCount || 0) <= 5
          ? "HAMPIR_HABIS"
          : "AMAN",
    });
    setEditingItem(null);
  };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      <div className="flex-1 pb-6 overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="p-4 bg-surface border-b border-border sticky top-0 z-20 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 mr-2">
              <div className="flex items-center gap-1.5 mb-1">
                <Store size={13} className="text-primary shrink-0" />
                <select
                  value={currentStand.id}
                  onChange={(e) => {
                    const chosen = stands.find((s) => s.id === e.target.value);
                    switchSellerStand(e.target.value, chosen?.name);
                  }}
                  className="bg-primary-soft text-primary-deep font-bold text-xs px-2 py-0.5 rounded-pill border border-primary/20 focus:outline-none cursor-pointer max-w-[220px] truncate"
                >
                  {stands.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <h1 className="text-base font-bold text-foreground">Menu & Ketersediaan</h1>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 bg-primary hover:bg-primary-deep text-white font-bold text-xs rounded-pill shadow-xs transition flex items-center gap-1 shrink-0"
            >
              <Plus size={14} /> Tambah
            </button>
          </div>

          {/* Search & Kategori */}
          <div className="relative mt-2">
            <Search className="absolute left-3 top-2.5 text-foreground-secondary" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama menu..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-background rounded-pill border border-border focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-2 mt-2.5 overflow-x-auto no-scrollbar">
            {["Semua", "Makanan", "Minuman", "Camilan"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-pill text-[11px] font-semibold transition ${
                  categoryFilter === cat
                    ? "bg-primary text-white shadow-xs"
                    : "bg-background text-foreground-secondary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Daftar Menu Penjual */}
        <div className="p-4 space-y-3">
          {filtered.map((item) => {
            const isHabis = item.stockStatus === "HABIS" || item.stockCount === 0;
            const isMenipis = item.stockStatus === "HAMPIR_HABIS";

            return (
              <div
                key={item.id}
                className="p-3 bg-surface rounded-card border border-border shadow-xs flex gap-3 items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-card object-cover border border-border/50 shrink-0"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-foreground">{item.name}</h3>
                    <p className="text-xs font-bold text-primary mt-0.5">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-foreground-secondary">
                        Stok: {item.stockCount || 18} / {item.stockMax || 30}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-pill ${
                          isHabis
                            ? "bg-status-danger-soft text-status-danger"
                            : isMenipis
                            ? "bg-[#FFF7DD] text-[#D99A00]"
                            : "bg-status-success-soft text-status-success"
                        }`}
                      >
                        {isHabis ? "Habis" : isMenipis ? "Hampir Habis" : "Stok Aman"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setEditingItem(item)}
                  className="px-2.5 py-1.5 bg-background hover:bg-foreground/5 text-foreground text-[11px] font-semibold rounded-pill border border-border transition flex items-center gap-1 shrink-0"
                >
                  <Edit3 size={12} />
                  <span>Edit</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />

      {/* Modal Edit Menu */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-[360px] bg-surface rounded-dialog p-5 shadow-2xl border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <h3 className="font-bold text-foreground text-sm">Edit Menu: {editingItem.name}</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-full text-foreground-secondary hover:bg-background"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Nama Menu</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Sisa Stok Porsi</label>
                <input
                  type="number"
                  value={editingItem.stockCount || 0}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, stockCount: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  deleteMenuItem(editingItem.id);
                  setEditingItem(null);
                }}
                className="p-2.5 text-status-danger hover:bg-status-danger-soft rounded-pill border border-status-danger/30 transition"
                title="Hapus Menu"
              >
                <Trash2 size={16} />
              </button>

              <button
                onClick={handleSaveEdit}
                className="flex-1 py-2.5 bg-primary hover:bg-primary-deep text-white font-bold text-xs rounded-pill shadow-xs transition"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Menu */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form onSubmit={handleAddSubmit} className="w-full max-w-[360px] bg-surface rounded-dialog p-5 shadow-2xl border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                <Plus size={16} className="text-primary" /> Tambah Menu Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-foreground-secondary hover:bg-background"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Nama Makanan/Minuman</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Nasi Bakar Cakalang"
                  className="w-full px-3 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-foreground block mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-foreground block mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-2 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Camilan">Camilan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Kuota Porsi Awal</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Deskripsi Singkat</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Bumbu rempah khas, lengkap dengan lauk..."
                  className="w-full px-3 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary resize-none h-14"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary hover:bg-primary-deep text-white font-bold text-xs rounded-pill shadow-xs transition"
            >
              Terbitkan Menu ke Mahasiswa
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
