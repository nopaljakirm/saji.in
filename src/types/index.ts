// Peran Pengguna (Mahasiswa/Pembeli vs Mitra Kantin/Penjual)
export type UserRole = "BUYER" | "SELLER";

// Data Pengguna
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  nim?: string;         // Untuk Mahasiswa (Pembeli)
  faculty?: string;     // Fakultas/Unit (misal: FILKOM)
  standId?: string;     // ID Stan yang dikelola jika rolenya SELLER
  allergies?: string[]; // Preferensi alergi mahasiswa (Kacang, Seafood, Telur, dll.)
}

// Data Stan Kantin FILKOM
export interface Stand {
  id: string;
  name: string;
  location: string;     // Misal: "Gedung F Lantai 1"
  image: string;
  rating: number;
  estimatedTime: string; // Misal: "10-15 mnt"
  isOpen: boolean;       // Status buka/tutup stan
  queueLength: number;   // Jumlah antrean aktif saat ini
  category: string;
}

// Data Menu Makanan/Minuman
export interface MenuItem {
  id: string;
  standId: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: "Makanan" | "Minuman" | "Camilan";
  isAvailable: boolean;  // Stok tersedia / habis
  isPopular?: boolean;
  allergens?: string[];  // Bahan pemicu alergi
  heatOptions?: string[]; // Pilihan level kepedasan / suhu
  portionOptions?: string[]; // Pilihan porsi (Biasa, Jumbo)
}

// Item di Dalam Keranjang Belanja
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedHeat?: string;     // Misal: "Sedang (Pedas Sedang)"
  selectedPortion?: string;  // Misal: "Porsi Jumbo (+3.000)"
  kitchenNote?: string;      // Catatan dapur khusus (misal: "Jangan pakai seledri")
}

// Siklus Hidup Status Pesanan (Order Lifecycle)
export type OrderStatus = 
  | "PENDING_PAYMENT"  // Menunggu pembayaran QRIS
  | "COOKING"          // Pembayaran sukses, pesanan sedang dimasak di dapur stan
  | "READY_IN_RACK"    // Makanan selesai dimasak & diletakkan di smart rack/locker
  | "COMPLETED"        // Makanan telah diambil oleh mahasiswa
  | "CANCELLED";       // Dibatalkan

// Data Transaksi Pesanan
export interface Order {
  id: string;                // Contoh ID di Figma: "KTN-0231"
  buyerId: string;
  buyerName: string;
  standId: string;
  standName: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  paymentMethod: "QRIS" | "SAJIPAY";
  paymentStatus: "UNPAID" | "PAID";
  rackSlot?: string;         // Lokasi rak cerdas (misal: "Rak B-03")
  pickupPin?: string;        // 4 digit PIN / OTP untuk membuka locker/verifikasi ambil
  createdAt: string;
  updatedAt: string;
}