import type { Metadata } from "next";
import "./globals.css";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans min-h-screen bg-[#F8F7F4]">
        <div className="flex justify-center min-h-screen">
          <div className="w-full max-w-[430px] min-h-screen bg-[#F8F7F4] relative shadow-lg flex flex-col border-x border-[#E8E5E0]">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
