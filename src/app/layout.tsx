import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Saji.in - Kantin Cerdas FILKOM UB",
  description: "Sistem Pemesanan & Pengambilan Mandiri Kantin Cerdas FILKOM UB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} font-sans min-h-screen bg-[#F8F7F4]`}>
        {/* Container pembungkus utama agar di layar laptop/desktop tetap di tengah seperti HP (430px) */}
        <div className="flex justify-center min-h-screen">
          <div className="w-full max-w-[430px] min-h-screen bg-[#F8F7F4] relative shadow-lg flex flex-col border-x border-[#E8E5E0]">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}