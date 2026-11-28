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
          status: "COOKING",
          paymentMethod: "QRIS",
          paymentStatus: "PAID",
          pickupPin: randomPin,
          createdAt: timeStr,
          updatedAt: timeStr,
        };

        const updated = [newOrder, ...get().orders];
        set({ orders: updated });

        return newOrder;
      },

      updateOrderStatus: (orderId, status, rackSlot) => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")} WIB`;

        const updated = get().orders.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              status,
              rackSlot: rackSlot !== undefined ? rackSlot : o.rackSlot,
              updatedAt: timeStr,
            };
          }
          return o;
        });

        set({ orders: updated });
      },

      verifyPickupPin: (orderId, pin) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (order && order.pickupPin === pin) {
          get().updateOrderStatus(orderId, "COMPLETED");
          return true;
        }
        return false;
      },

      getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),
      getOrdersByBuyer: (buyerId) => get().orders.filter((o) => o.buyerId === buyerId),
      getOrdersByStand: (standId) => get().orders.filter((o) => o.standId === standId),
      getActiveOrderForBuyer: (buyerId) =>
        get().orders.find(
          (o) =>
            o.buyerId === buyerId &&
            (o.status === "COOKING" || o.status === "READY_IN_RACK" || o.status === "PENDING_PAYMENT")
        ),
    }),
    {
      name: "sajiin-orders-storage",
    }
  )
);

// SINKRONISASI REAL-TIME ANTAR TAB BROWSER (0-DETIK)
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "sajiin-orders-storage" && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (parsed.state && parsed.state.orders) {
          useOrderStore.setState({ orders: parsed.state.orders });
        }
      } catch (e) {
        console.error("Gagal sinkronisasi data pesanan antar-tab", e);
      }
    }
  });
}
