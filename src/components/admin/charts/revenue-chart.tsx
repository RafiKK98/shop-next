"use client";

import { useId } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { DailyRevenue } from "@/services/admin/analytics";
import { formatCurrency, formatDateShort } from "@/utils/format";

interface RevenueChartProps {
  data: DailyRevenue[];
}

function formatChartDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function RevenueChart({ data }: RevenueChartProps) {
  const id = useId();

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-base-200" />
          <XAxis
            dataKey="date"
            tickFormatter={formatChartDate}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            className="text-base-content/40"
          />
          <YAxis
            tickFormatter={(v: number) => `$${v}`}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            className="text-base-content/40"
          />
          <Tooltip
            content={
              <CustomTooltip />
            }
          />
          <Bar
            dataKey="revenue"
            fill="var(--color-primary, oklch(0.546 0.245 262.881))"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-base-200 bg-base-100 px-3 py-2 shadow-lg">
      <p className="text-xs text-base-content/50">{formatDateShort(label + "T00:00:00")}</p>
      <p className="text-sm font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}
