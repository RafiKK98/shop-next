"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import type { OrderStatusCount } from "@/services/admin/analytics";

const STATUS_COLORS: Record<string, string> = {
  pending: "oklch(0.6 0.12 80)",
  paid: "oklch(0.55 0.2 240)",
  processing: "oklch(0.55 0.2 200)",
  shipped: "oklch(0.55 0.2 160)",
  delivered: "oklch(0.55 0.2 120)",
  cancelled: "oklch(0.5 0.05 0)",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

interface OrderStatusChartProps {
  data: OrderStatusCount[];
}

export function OrderStatusChart({ data }: OrderStatusChartProps) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-base-200"
            horizontal={false}
          />
          <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="status"
            tickFormatter={(s: string) => STATUS_LABELS[s] ?? s}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={90}
          />
          <Tooltip
            content={<StatusTooltip />}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
            {data.map((entry) => (
              <Cell
                key={entry.status}
                fill={STATUS_COLORS[entry.status] ?? "oklch(0.6 0.12 80)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function StatusTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-base-200 bg-base-100 px-3 py-2 shadow-lg">
      <p className="text-xs font-medium">{STATUS_LABELS[label] ?? label}</p>
      <p className="text-sm font-semibold">
        {payload[0].value} order{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
