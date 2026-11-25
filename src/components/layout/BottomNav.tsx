"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useOrderStore } from "@/stores/orderStore";
import { useCartStore } from "@/stores/cartStore";
import {
  Home,
  UtensilsCrossed,
  Clock,
  History,
  User,
  LayoutDashboard,
  ChefHat,
  PackageCheck,
  Store,
  ShoppingCart,
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const { currentUser } = useAuthStore();
  const { getActiveOrderForBuyer, orders } = useOrderStore();
  const { getTotalItems } = useCartStore();

  // Mencegah hydration mismatch antara server dan client localStorage
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isBuyer = currentUser?.role === "BUYER";
  const cartCount = isMounted ? getTotalItems() : 0;
  const activeOrder = isMounted && currentUser ? getActiveOrderForBuyer(currentUser.id) : null;
  const pendingCookingCount = isMounted ? orders.filter((o) => o.status === "COOKING").length : 0;

  if (isBuyer) {
    return (
      <nav className="h-16 bg-surface border-t border-border flex items-center justify-around px-2 z-30">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1 transition ${
            pathname === "/" ? "text-primary font-semibold" : "text-foreground-secondary hover:text-foreground"
          }`}
        >
          <Home size={20} />
          <span className="text-[10px]">Beranda</span>
        </Link>

        <Link
          href="/cart"
          className={`flex flex-col items-center gap-1 relative transition ${
            pathname === "/cart" ? "text-primary font-semibold" : "text-foreground-secondary hover:text-foreground"
          }`}
        >
          <div className="relative">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Keranjang</span>
        </Link>

        <Link
          href="/orders"
          className={`flex flex-col items-center gap-1 relative transition ${
            pathname.startsWith("/orders") ? "text-primary font-semibold" : "text-foreground-secondary hover:text-foreground"
          }`}
        >
          <div className="relative">
            <Clock size={20} />
            {activeOrder && (
              <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-status-warning rounded-full animate-ping" />
            )}
          </div>
          <span className="text-[10px]">Pesanan</span>
        </Link>

        <Link
          href="/history"
          className={`flex flex-col items-center gap-1 transition ${
            pathname === "/history" ? "text-primary font-semibold" : "text-foreground-secondary hover:text-foreground"
          }`}
        >
          <History size={20} />
          <span className="text-[10px]">Riwayat</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 transition ${
            pathname === "/profile" ? "text-primary font-semibold" : "text-foreground-secondary hover:text-foreground"
          }`}
        >
          <User size={20} />
          <span className="text-[10px]">Profil</span>
        </Link>
      </nav>
    );
  }

  // Tampilan Bottom Bar Penjual (SellerApp)
  return (
    <nav className="h-16 bg-surface border-t border-border flex items-center justify-around px-2 z-30">
      <Link
        href="/seller/ringkasan"
        className={`flex flex-col items-center gap-1 transition ${
          pathname === "/seller/ringkasan" ? "text-primary font-semibold" : "text-foreground-secondary hover:text-foreground"
        }`}
      >
        <LayoutDashboard size={20} />
        <span className="text-[10px]">Ringkasan</span>
      </Link>

      <Link
        href="/seller/dapur"
        className={`flex flex-col items-center gap-1 relative transition ${
          pathname === "/seller/dapur" ? "text-primary font-semibold" : "text-foreground-secondary hover:text-foreground"
        }`}
      >
        <div className="relative">
          <ChefHat size={20} />
          {pendingCookingCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {pendingCookingCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Dapur KDS</span>
      </Link>

      <Link
        href="/seller/penyerahan"
        className={`flex flex-col items-center gap-1 transition ${
          pathname === "/seller/penyerahan" ? "text-primary font-semibold" : "text-foreground-secondary hover:text-foreground"
        }`}
      >
        <PackageCheck size={20} />
        <span className="text-[10px]">Penyerahan</span>
      </Link>

      <Link
        href="/seller/menu"
        className={`flex flex-col items-center gap-1 transition ${
          pathname === "/seller/menu" ? "text-primary font-semibold" : "text-foreground-secondary hover:text-foreground"
        }`}
      >
        <UtensilsCrossed size={20} />
        <span className="text-[10px]">Menu</span>
      </Link>

      <Link
        href="/seller/stand"
        className={`flex flex-col items-center gap-1 transition ${
          pathname === "/seller/stand" ? "text-primary font-semibold" : "text-foreground-secondary hover:text-foreground"
        }`}
      >
        <Store size={20} />
        <span className="text-[10px]">Stan</span>
      </Link>
    </nav>
  );
}