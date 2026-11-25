import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Order, OrderStatus, CartItem, User } from "@/types";
import { initialOrders } from "@/data/mockData";

interface OrderState {
  orders: Order[];
  createOrder: (
    buyer: User,
    standId: string,
    standName: string,
    items: CartItem[],
    totalPrice: number
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, rackSlot?: string) => void;
  verifyPickupPin: (orderId: string, pin: string) => boolean;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByBuyer: (buyerId: string) => Order[];
  getOrdersByStand: (standId: string) => Order[];
  getActiveOrderForBuyer: (buyerId: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      // Dimulai dengan data sample KTN-0231 dari Figma
      orders: initialOrders,

      createOrder: (buyer, standId, standName, items, totalPrice) => {
        const newOrderId = `KTN-0${Math.floor(100 + Math.random() * 900)}`;
        const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")} WIB`;

        const newOrder: Order = {
          id: newOrderId,
          buyerId: buyer.id,
          buyerName: buyer.name,
          standId,
          standName,
          items,
          totalPrice,
          status: "COOKING", // Setelah bayar QRIS langsung masuk ke tahap Sedang Dimasak
          paymentMethod: "QRIS",
          paymentStatus: "PAID",
          pickupPin: randomPin,
          createdAt: timeStr,
          updatedAt: timeStr,
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      updateOrderStatus: (orderId: string, status: OrderStatus, rackSlot?: string) => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")} WIB`;

        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id === orderId) {
              return {
                ...o,
                status,
                rackSlot: rackSlot !== undefined ? rackSlot : o.rackSlot,
                updatedAt: timeStr,
              };
            }
            return o;
          }),
        }));
      },

      verifyPickupPin: (orderId: string, pin: string) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (order && order.pickupPin === pin) {
          get().updateOrderStatus(orderId, "COMPLETED");
          return true;
        }
        return false;
      },

      getOrderById: (orderId: string) => {
        return get().orders.find((o) => o.id === orderId);
      },

      getOrdersByBuyer: (buyerId: string) => {
        return get().orders.filter((o) => o.buyerId === buyerId);
      },

      getOrdersByStand: (standId: string) => {
        return get().orders.filter((o) => o.standId === standId);
      },

      // Mengambil pesanan aktif (yang belum selesai / dibatalkan) untuk banner floating
      getActiveOrderForBuyer: (buyerId: string) => {
        return get().orders.find(
          (o) =>
            o.buyerId === buyerId &&
            (o.status === "COOKING" || o.status === "READY_IN_RACK" || o.status === "PENDING_PAYMENT")
        );
      },
    }),
    {
      name: "sajiin-orders-storage",
    }
  )
);