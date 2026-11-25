import { OrderStatus } from "@/types";
import { ChefHat, CheckCircle2, Clock, Check, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const isSm = size === "sm";

  switch (status) {
    case "COOKING":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-pill bg-[#FFF7DD] text-[#D99A00] border border-[#D99A00]/20 ${
            isSm ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
          }`}
        >
          <ChefHat size={isSm ? 12 : 14} />
          Sedang Dimasak
        </span>
      );

    case "READY_IN_RACK":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-pill bg-[#EAF7EF] text-[#2E8B57] border border-[#2E8B57]/20 ${
            isSm ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
          }`}
        >
          <CheckCircle2 size={isSm ? 12 : 14} />
          Siap di Rak
        </span>
      );

    case "COMPLETED":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-pill bg-[#F1EFEB] text-[#737373] ${
            isSm ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
          }`}
        >
          <Check size={isSm ? 12 : 14} />
          Selesai
        </span>
      );

    case "PENDING_PAYMENT":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-pill bg-[#EFF4FE] text-[#1E5CFA] ${
            isSm ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
          }`}
        >
          <Clock size={isSm ? 12 : 14} />
          Menunggu Bayar
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center gap-1 font-semibold rounded-pill bg-gray-100 text-gray-500 px-2 py-0.5 text-xs">
          <XCircle size={12} />
          {status}
        </span>
      );
  }
}