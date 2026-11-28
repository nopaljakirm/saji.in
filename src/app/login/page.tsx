"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useStandStore } from "@/stores/standStore";
import { UserRole } from "@/types";
import {
  UtensilsCrossed,
  ArrowRight,
  GraduationCap,
  Store,
  Check,
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, registerBuyer, registerSeller } = useAuthStore();
  const { stands, addStand } = useStandStore();

  const [authMode, setAuthMode] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [registerRole, setRegisterRole] = useState<UserRole>("BUYER");

  // Form Login
  const [loginIdentifier, setLoginIdentifier] = useState("alif.raditya@student.ub.ac.id");
  const [loginPassword, setLoginPassword] = useState("••••••••");
  const [loginRole, setLoginRole] = useState<UserRole>("BUYER");
  const [selectedLoginStandId, setSelectedLoginStandId] = useState<string>("stand-1");

  // Form Register Mahasiswa
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerNim, setBuyerNim] = useState("");
  const [buyerFaculty, setBuyerFaculty] = useState("FILKOM");

  // Form Register Penjual
  const [sellerName, setSellerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [standName, setStandName] = useState("");
  const [standLocation, setStandLocation] = useState("Kantin Gedung F - Stand #04");
  const [standCategory, setStandCategory] = useState("Makanan Berat");

  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Submit Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginIdentifier, loginRole, selectedLoginStandId);
    if (loginRole === "BUYER") {
      router.push("/");
    } else {
      router.push("/seller/ringkasan");
    }
  };

  // Submit Register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;

    if (registerRole === "BUYER") {
      registerBuyer({
        name: buyerName || "Alif Raditya Pratama",
        email: buyerEmail || "alif.raditya@student.ub.ac.id",
        nim: buyerNim || "225150200111",
        faculty: buyerFaculty || "FILKOM UB",
      });
      router.push("/");
    } else {
      const newStandId = registerSeller({
        name: sellerName || "Ibu Siti",
        email: sellerEmail || "busiti.filkom@gmail.com",
        standName: standName || "Warung Bu Siti",
        standLocation: standLocation || "Kantin Gedung F - Stand #04",
        category: standCategory,
      });

      // Daftarkan stan baru agar langsung muncul di beranda mahasiswa!
      addStand({
        id: newStandId,
        name: standName || "Warung Bu Siti",
        location: standLocation || "Kantin Gedung F - Stand #04",
        image:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
        rating: 5.0,
        estimatedTime: "10-15 mnt",
        isOpen: true,
        queueLength: 0,
        category: standCategory,
      });

      router.push("/seller/ringkasan");
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen p-5 bg-background">
      <div className="flex-1 flex flex-col justify-center max-w-[390px] mx-auto w-full py-6">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary text-white rounded-card flex items-center justify-center mx-auto mb-3 shadow-md">
            <UtensilsCrossed size={30} />
          </div>
          <h1 className="text-2xl font-black text-foreground">Saji.in</h1>
          <p className="text-xs text-foreground-secondary mt-1">
            Kantin Cerdas FILKOM Universitas Brawijaya
          </p>
        </div>

        {/* Tab Switcher Masuk vs Daftar (Persis Figma) */}
        <div className="bg-surface p-1 rounded-pill border border-border flex mb-5 shadow-xs">
          <button
            onClick={() => setAuthMode("LOGIN")}
            className={`flex-1 py-2 text-xs font-bold rounded-pill transition ${
              authMode === "LOGIN"
                ? "bg-primary text-white shadow-xs"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            Masuk (Login)
          </button>
          <button
            onClick={() => setAuthMode("REGISTER")}
            className={`flex-1 py-2 text-xs font-bold rounded-pill transition ${
              authMode === "REGISTER"
                ? "bg-primary text-white shadow-xs"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            Daftar Akun Baru
          </button>
        </div>

        {/* TAMPILAN LOGIN */}
        {authMode === "LOGIN" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 bg-surface p-5 rounded-dialog border border-border shadow-xs">
            {/* Pemilih Peran Login */}
            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1.5">
                Pilih Akun Sebagai:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole("BUYER");
                    setLoginIdentifier("alif.raditya@student.ub.ac.id");
                  }}
                  className={`p-2.5 rounded-card border text-left text-xs font-semibold flex items-center gap-2 transition ${
                    loginRole === "BUYER"
                      ? "border-primary bg-primary-soft text-primary-deep"
                      : "border-border text-foreground-secondary hover:bg-background"
                  }`}
                >
                  <GraduationCap size={16} className={loginRole === "BUYER" ? "text-primary" : ""} />
                  <span>Mahasiswa</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginRole("SELLER");
                    setLoginIdentifier("busiti.filkom@gmail.com");
                  }}
                  className={`p-2.5 rounded-card border text-left text-xs font-semibold flex items-center gap-2 transition ${
                    loginRole === "SELLER"
                      ? "border-primary bg-primary-soft text-primary-deep"
                      : "border-border text-foreground-secondary hover:bg-background"
                  }`}
                >
                  <Store size={16} className={loginRole === "SELLER" ? "text-primary" : ""} />
                  <span>Mitra Penjual</span>
                </button>
              </div>
            </div>

            {/* Pilihan Stan Jika Login Sebagai Mitra Penjual */}
            {loginRole === "SELLER" && (
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">
                  Pilih Stan Kantin Anda
                </label>
                <div className="relative">
                  <select
                    value={selectedLoginStandId}
                    onChange={(e) => setSelectedLoginStandId(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary font-medium cursor-pointer"
                  >
                    {stands.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.location})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">
                Email / NIM / ID Stand
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-foreground-secondary" size={15} />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="contoh: alif@student.ub.ac.id"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-foreground">Kata Sandi</label>
                <span className="text-[10px] text-primary hover:underline cursor-pointer">
                  Lupa sandi?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-foreground-secondary" size={15} />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-deep text-white text-xs font-bold rounded-pill shadow-md transition active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              <span>Masuk Sekarang</span>
              <ArrowRight size={14} />
            </button>

            {/* Quick Demo Login Preset */}
            <div className="pt-3 border-t border-border text-center">
              <span className="text-[10px] text-foreground-secondary block mb-2 font-medium">
                Pintasan Demo Instan (Pengujian Mandiri):
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    login("alif.raditya@student.ub.ac.id", "BUYER");
                    router.push("/");
                  }}
                  className="py-1.5 px-1 bg-background hover:bg-primary-soft hover:text-primary text-[10px] font-semibold rounded border border-border transition text-center"
                >
                  🎓 Mahasiswa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    login("geprek.filkom@gmail.com", "SELLER", "stand-1");
                    router.push("/seller/ringkasan");
                  }}
                  className="py-1.5 px-1 bg-background hover:bg-primary-soft hover:text-primary text-[10px] font-semibold rounded border border-border transition text-center"
                >
                  🍗 Stan 01 (Geprek)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    login("baratie.filkom@gmail.com", "SELLER", "stand-3");
                    router.push("/seller/ringkasan");
                  }}
                  className="py-1.5 px-1 bg-background hover:bg-primary-soft hover:text-primary text-[10px] font-semibold rounded border border-border transition text-center"
                >
                  ☕ Stan 03 (Baratie)
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* TAMPILAN REGISTRASI LENGKAP */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 bg-surface p-5 rounded-dialog border border-border shadow-xs">
            {/* Pemilih Peran Registrasi (Persis Figma) */}
            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1.5">
                Pilih Peran Pendaftaran:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div
                  onClick={() => setRegisterRole("BUYER")}
                  className={`p-3 rounded-card border cursor-pointer transition ${
                    registerRole === "BUYER"
                      ? "border-primary bg-primary-soft text-primary-deep"
                      : "border-border text-foreground-secondary hover:bg-background"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl">🎓</span>
                    {registerRole === "BUYER" && <Check size={14} className="text-primary" />}
                  </div>
                  <h4 className="font-bold text-xs">Pembeli</h4>
                  <p className="text-[10px] opacity-80">Mahasiswa / Tamu</p>
                </div>

                <div
                  onClick={() => setRegisterRole("SELLER")}
                  className={`p-3 rounded-card border cursor-pointer transition ${
                    registerRole === "SELLER"
                      ? "border-primary bg-primary-soft text-primary-deep"
                      : "border-border text-foreground-secondary hover:bg-background"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl">🍳</span>
                    {registerRole === "SELLER" && <Check size={14} className="text-primary" />}
                  </div>
                  <h4 className="font-bold text-xs">Penjual</h4>
                  <p className="text-[10px] opacity-80">Stand / Mitra Warung</p>
                </div>
              </div>
            </div>

            {/* FORM MAHASISWA */}
            {registerRole === "BUYER" ? (
              <>
                <div>
                  <label className="text-[11px] font-bold text-foreground block mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="contoh: Alif Raditya Pratama"
                    className="w-full px-3 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-foreground block mb-1">
                    Email / Nomor WhatsApp
                  </label>
                  <input
                    type="text"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="contoh: alif@student.ub.ac.id"
                    className="w-full px-3 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-foreground block mb-1">NIM</label>
                    <input
                      type="text"
                      value={buyerNim}
                      onChange={(e) => setBuyerNim(e.target.value)}
                      placeholder="225150200111"
                      className="w-full px-3 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-foreground block mb-1">Fakultas</label>
                    <input
                      type="text"
                      value={buyerFaculty}
                      onChange={(e) => setBuyerFaculty(e.target.value)}
                      placeholder="FILKOM"
                      className="w-full px-3 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-status-success-soft rounded-card border border-status-success/20 text-[11px] text-status-success flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>Bonus Saldo SajiPay Awal: <strong>Rp 50.000</strong></span>
                </div>
              </>
            ) : (
              /* FORM MITRA PENJUAL */
              <>
                <div>
                  <label className="text-[11px] font-bold text-foreground block mb-1">Nama Pemilik Stand</label>
                  <input
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="contoh: Ibu Siti"
                    className="w-full px-3 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-foreground block mb-1">Nama Stand / Warung</label>
                  <input
                    type="text"
                    value={standName}
                    onChange={(e) => setStandName(e.target.value)}
                    placeholder="contoh: Warung Bu Siti"
                    className="w-full px-3 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-foreground block mb-1">Lokasi / Stand</label>
                    <input
                      type="text"
                      value={standLocation}
                      onChange={(e) => setStandLocation(e.target.value)}
                      placeholder="Stand #04"
                      className="w-full px-3 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-foreground block mb-1">Kategori</label>
                    <select
                      value={standCategory}
                      onChange={(e) => setStandCategory(e.target.value)}
                      className="w-full px-2 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary"
                    >
                      <option value="Makanan Berat">Makanan Berat</option>
                      <option value="Aneka Kuah">Aneka Kuah</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Camilan">Camilan</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] font-bold text-foreground block mb-1">Kata Sandi</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full px-3 py-2 text-xs bg-background rounded-card border border-border focus:outline-none focus:border-primary"
                required
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-primary focus:ring-primary"
              />
              <span className="text-[10px] text-foreground-secondary leading-tight">
                Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi Saji.in FILKOM UB.
              </span>
            </label>

            <button
              type="submit"
              disabled={!agreeTerms}
              className="w-full py-3 bg-primary hover:bg-primary-deep disabled:opacity-50 text-white text-xs font-bold rounded-pill shadow-md transition active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              <span>Daftar Sekarang</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>

      <div className="text-center text-[11px] text-foreground-secondary py-2">
        Kantin Cerdas FILKOM • UB Malang
      </div>
    </div>
  );
}
