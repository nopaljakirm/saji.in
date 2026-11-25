import { Stand, MenuItem, Order, User } from "@/types";

// User Default untuk simulasi awal
export const mockUsers: User[] = [
  {
    id: "user-buyer-1",
    name: "Raven Pratama",
    email: "raven@student.ub.ac.id",
    role: "BUYER",
    nim: "235150201111045",
    faculty: "Fakultas Ilmu Komputer (FILKOM)",
    allergies: ["Kacang"],
  },
  {
    id: "user-seller-1",
    name: "Pak Bambang (Stan 02)",
    email: "bambang.filkom@gmail.com",
    role: "SELLER",
    standId: "stand-1",
  },
];

// Daftar Stan di Kantin FILKOM UB
export const mockStands: Stand[] = [
  {
    id: "stand-1",
    name: "Ayam Geprek & Nasi Goreng FILKOM",
    location: "Kantin Gedung F - Stan 01",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    estimatedTime: "10-15 mnt",
    isOpen: true,
    queueLength: 3,
    category: "Makanan Berat",
  },
  {
    id: "stand-2",
    name: "Soto Lamongan & Rawon Bu Darmi",
    location: "Kantin Gedung F - Stan 02",
    image: "https://images.unsplash.com/photo-1572441713132-c542fc4fe282?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    estimatedTime: "8-12 mnt",
    isOpen: true,
    queueLength: 2,
    category: "Aneka Kuah",
  },
  {
    id: "stand-3",
    name: "Baratie Drink & Coffee",
    location: "Kantin Gedung G - Stan Minuman",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    estimatedTime: "3-5 mnt",
    isOpen: true,
    queueLength: 1,
    category: "Minuman",
  },
];

// Menu Makanan & Minuman
export const mockMenuItems: MenuItem[] = [
  {
    id: "menu-1",
    standId: "stand-1",
    name: "Nasi Goreng Spesial FILKOM",
    price: 15000,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80",
    description: "Nasi goreng bumbu racik khas dengan telur ceplok, suwiran ayam gurih, dan acar segar.",
    category: "Makanan",
    isAvailable: true,
    isPopular: true,
    allergens: ["Telur"],
    heatOptions: ["Level 0 (Tidak Pedas)", "Level 1 (Pedas Sedang)", "Level 2 (Pedas Ekstra)"],
    portionOptions: ["Porsi Standar", "Porsi Kenyang (+Rp 3.000)"],
  },
  {
    id: "menu-2",
    standId: "stand-1",
    name: "Ayam Geprek Sambal Bawang",
    price: 14000,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
    description: "Ayam goreng tepung renyah dengan ulekan sambal bawang pedas nampol khas Malang.",
    category: "Makanan",
    isAvailable: true,
    isPopular: true,
    heatOptions: ["Level 1 (Cabai 3)", "Level 2 (Cabai 7)", "Level 3 (Cabai 12)"],
    portionOptions: ["Porsi Biasa", "Tambah Nasi (+Rp 3.000)"],
  },
  {
    id: "menu-3",
    standId: "stand-1",
    name: "Mie Nyemek Pedas Gurih",
    price: 12000,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80",
    description: "Mie kuah kental dengan potongan sayuran segar, telur orak-arik, dan taburan bawang goreng.",
    category: "Makanan",
    isAvailable: true,
    allergens: ["Telur", "Gluten"],
    heatOptions: ["Sedang", "Pedas"],
    portionOptions: ["Standar"],
  },
  {
    id: "menu-4",
    standId: "stand-3",
    name: "Es Teh Manis Kampul",
    price: 4000,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80",
    description: "Teh melati wangi dingin segar dengan perasan jeruk nipis kampul segar.",
    category: "Minuman",
    isAvailable: true,
    isPopular: true,
    heatOptions: ["Es Normal", "Sedikit Es", "Hangat"],
  },
  {
    id: "menu-5",
    standId: "stand-3",
    name: "Es Kopi Susu Aren FILKOM",
    price: 10000,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
    description: "Kopi robusta Dampit dipadu susu creamy dan manis legit gula aren asli.",
    category: "Minuman",
    isAvailable: true,
    isPopular: true,
    heatOptions: ["Dingin", "Panas"],
  },
];

// Data Awal Pesanan untuk Uji Coba Simulasi (Seperti di Figma)
export const initialOrders: Order[] = [
  {
    id: "KTN-0231",
    buyerId: "user-buyer-1",
    buyerName: "Raven Pratama",
    standId: "stand-1",
    standName: "Ayam Geprek & Nasi Goreng FILKOM",
    items: [
      {
        menuItem: mockMenuItems[0], // Nasi Goreng
        quantity: 1,
        selectedHeat: "Level 1 (Pedas Sedang)",
        selectedPortion: "Porsi Standar",
        kitchenNote: "Banyakin kerupuknya mas",
      },
      {
        menuItem: mockMenuItems[3], // Es Teh
        quantity: 1,
        selectedHeat: "Es Normal",
      },
    ],
    totalPrice: 19000,
    status: "COOKING", // Status: Sedang Dimasak
    paymentMethod: "QRIS",
    paymentStatus: "PAID",
    rackSlot: "Rak B-03",
    pickupPin: "5821",
    createdAt: "12:15 WIB",
    updatedAt: "12:20 WIB",
  },
  {
    id: "KTN-0230",
    buyerId: "user-buyer-1",
    buyerName: "Raven Pratama",
    standId: "stand-1",
    standName: "Ayam Geprek & Nasi Goreng FILKOM",
    items: [
      {
        menuItem: mockMenuItems[1],
        quantity: 1,
        selectedHeat: "Level 2 (Cabai 7)",
      },
    ],
    totalPrice: 14000,
    status: "READY_IN_RACK", // Status: Siap Diambil di Rak
    paymentMethod: "QRIS",
    paymentStatus: "PAID",
    rackSlot: "Rak A-01",
    pickupPin: "9134",
    createdAt: "11:50 WIB",
    updatedAt: "12:05 WIB",
  },
];