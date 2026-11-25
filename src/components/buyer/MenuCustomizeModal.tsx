"use client";

import { useState } from "react";
import { MenuItem } from "@/types";
import { useCartStore } from "@/stores/cartStore";
import { X, Plus, Minus, Check, Flame, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuCustomizeModalProps {
  item: MenuItem | null;
  standName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuCustomizeModal({
  item,
  standName,
  isOpen,
  onClose,
}: MenuCustomizeModalProps) {
  const { addItem } = useCartStore();

  const [selectedHeat, setSelectedHeat] = useState<string>("");
  const [selectedPortion, setSelectedPortion] = useState<string>("");
  const [kitchenNote, setKitchenNote] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [conflictWarning, setConflictWarning] = useState<boolean>(false);

  // Set default saat modal dibuka
  if (item && selectedHeat === "" && item.heatOptions && item.heatOptions.length > 0) {
    setSelectedHeat(item.heatOptions[0]);
  }
  if (item && selectedPortion === "" && item.portionOptions && item.portionOptions.length > 0) {
    setSelectedPortion(item.portionOptions[0]);
  }

  if (!isOpen || !item) return null;

  // Hitung total harga item
  let unitPrice = item.price;
  if (selectedPortion.includes("+Rp 3.000")) {
    unitPrice += 3000;
  }
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const result = addItem(item, standName, quantity, {
      selectedHeat: selectedHeat || undefined,
      selectedPortion: selectedPortion || undefined,
      kitchenNote: kitchenNote || undefined,
    });

    if (result.conflict) {
      setConflictWarning(true);
      return;
    }

    // Reset dan tutup
    setQuantity(1);
    setKitchenNote("");
    setConflictWarning(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full max-w-[430px] bg-surface rounded-t-dialog max-h-[85vh] flex flex-col shadow-2xl border-t border-border overflow-hidden"
        >
          {/* Header Modal */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-foreground text-base">Kustomisasi Menu</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-foreground/5 text-foreground-secondary"
            >
              <X size={20} />
            </button>
          </div>

          {/* Konten Scrollable */}
          <div className="p-4 overflow-y-auto space-y-5 no-scrollbar flex-1">
            {/* Detail Singkat Menu */}
            <div className="flex gap-3 items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-card object-cover border border-border"
              />
              <div>
                <h4 className="font-bold text-foreground text-base leading-tight">{item.name}</h4>
                <p className="text-xs text-foreground-secondary mt-1">{standName}</p>
                <p className="text-primary font-bold text-sm mt-1">
                  Rp {unitPrice.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {/* Peringatan jika ada pesanan dari stan lain */}
            {conflictWarning && (
              <div className="p-3 bg-status-danger-soft border border-status-danger/30 rounded-card text-xs text-status-danger">
                <strong>Keranjang berbeda stan!</strong> Selesaikan atau kosongkan pesanan stan sebelumnya terlebih dahulu.
              </div>
            )}

            {/* Pilihan Level Kepedasan / Suhu */}
            {item.heatOptions && item.heatOptions.length > 0 && (
              <div>
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-2">
                  <Flame size={14} className="text-primary" />
                  Tingkat Kepedasan / Pilihan Suhu
                </label>
                <div className="space-y-2">
                  {item.heatOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedHeat(opt)}
                      className={`w-full p-2.5 rounded-card border text-left text-xs font-medium flex items-center justify-between transition ${
                        selectedHeat === opt
                          ? "border-primary bg-primary-soft text-primary-deep font-semibold"
                          : "border-border text-foreground hover:bg-foreground/5"
                      }`}
                    >
                      <span>{opt}</span>
                      {selectedHeat === opt && <Check size={16} className="text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pilihan Porsi */}
            {item.portionOptions && item.portionOptions.length > 0 && (
              <div>
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-2">
                  <Utensils size={14} className="text-primary" />
                  Pilihan Porsi
                </label>
                <div className="space-y-2">
                  {item.portionOptions.map((portion) => (
                    <button
                      key={portion}
                      onClick={() => setSelectedPortion(portion)}
                      className={`w-full p-2.5 rounded-card border text-left text-xs font-medium flex items-center justify-between transition ${
                        selectedPortion === portion
                          ? "border-primary bg-primary-soft text-primary-deep font-semibold"
                          : "border-border text-foreground hover:bg-foreground/5"
                      }`}
                    >
                      <span>{portion}</span>
                      {selectedPortion === portion && <Check size={16} className="text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Catatan Dapur */}
            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">
                Catatan untuk Dapur (Opsional)
              </label>
              <textarea
                value={kitchenNote}
                onChange={(e) => setKitchenNote(e.target.value)}
                placeholder="Contoh: Sambal dipisah, jangan pakai bawang goreng..."
                className="w-full text-xs p-3 rounded-card border border-border bg-background focus:outline-none focus:border-primary resize-none h-18"
              />
            </div>
          </div>

          {/* Footer Aksi Tambah */}
          <div className="p-4 border-t border-border bg-surface flex items-center gap-3">
            {/* Counter Jumlah */}
            <div className="flex items-center border border-border rounded-pill px-2 py-1 gap-3 bg-background">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-6 h-6 rounded-full flex items-center justify-center text-foreground hover:bg-surface transition"
              >
                <Minus size={14} />
              </button>
              <span className="text-xs font-bold min-w-[16px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-foreground hover:bg-surface transition"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Tombol Tambah ke Keranjang */}
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 px-4 bg-primary hover:bg-primary-deep text-white rounded-pill font-bold text-xs flex items-center justify-between shadow-md transition active:scale-[0.98]"
            >
              <span>+ Masukkan Keranjang</span>
              <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}