"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus, updatePaymentStatus } from "@/actions/admin/orders";
import { notify, errors } from "@/lib/notifications";
import {
  ORDER_STATUS_LABEL,
  VALID_ORDER_TRANSITIONS,
  VALID_PAYMENT_TRANSITIONS,
  PAYMENT_STATUS_LABEL,
  type OrderStatus,
  type PaymentStatus,
} from "@/services/admin/order-types";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const allowedTransitions = VALID_ORDER_TRANSITIONS[currentStatus];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    const previousValue = currentStatus;

    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if ("error" in result) {
        notify.error(result.error);
      } else {
        notify.success(
          `Order status updated to ${ORDER_STATUS_LABEL[newStatus]}`,
        );
        router.refresh();
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={isPending || allowedTransitions.length === 0}
        className="select select-sm w-40"
        aria-label="Change order status"
      >
        <option value={currentStatus} disabled>
          {ORDER_STATUS_LABEL[currentStatus]}
        </option>
        {allowedTransitions.map((status) => (
          <option key={status} value={status}>
            {ORDER_STATUS_LABEL[status]}
          </option>
        ))}
      </select>
      {isPending && <span className="loading loading-spinner loading-sm" />}
    </div>
  );
}

interface PaymentStatusSelectProps {
  orderId: string;
  currentStatus: PaymentStatus;
}

export function PaymentStatusSelect({
  orderId,
  currentStatus,
}: PaymentStatusSelectProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const allowedTransitions = VALID_PAYMENT_TRANSITIONS[currentStatus];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as PaymentStatus;
    const previousValue = currentStatus;

    startTransition(async () => {
      const result = await updatePaymentStatus(orderId, newStatus);
      if ("error" in result) {
        notify.error(result.error);
      } else {
        notify.success(
          `Payment status updated to ${PAYMENT_STATUS_LABEL[newStatus]}`,
        );
        router.refresh();
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={isPending || allowedTransitions.length === 0}
        className="select select-sm w-40"
        aria-label="Change payment status"
      >
        <option value={currentStatus} disabled>
          {PAYMENT_STATUS_LABEL[currentStatus]}
        </option>
        {allowedTransitions.map((status) => (
          <option key={status} value={status}>
            {PAYMENT_STATUS_LABEL[status]}
          </option>
        ))}
      </select>
      {isPending && <span className="loading loading-spinner loading-sm" />}
    </div>
  );
}
