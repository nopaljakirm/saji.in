import { Sparkles, UtensilsCrossed } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 p-6 flex flex-col justify-between">
      <div className="pt-8">
        <div className="w-14 h-14 bg-primary rounded-card flex items-center justify-center text-white mb-4 shadow-md">
          <UtensilsCrossed size={28} />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Saji.in</h1>
        <p className="text-foreground-secondary text-sm mt-1">
          Kantin Cerdas FILKOM Universitas Brawijaya
        </p>

        <div className="mt-6 p-4 bg-primary-soft border border-primary/20 rounded-card flex items-start gap-3">
          <Sparkles className="text-primary shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-primary-deep font-medium leading-relaxed">
            Fondasi Design Tokens dari Figma berhasil terpasang menggunakan Tailwind v4 & Plus Jakarta Sans!
          </p>
        </div>
      </div>

      <div className="pb-6">
        <div className="p-3 bg-surface rounded-card border border-border text-center text-xs text-foreground-secondary">
          Tahap 1 Fondasi Berhasil
        </div>
      </div>
    </main>
  );
}