import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { simulate } from "../simulation/simulate";

interface Props {
  className?: string;
}

const BASELINE_PARAMS = { arrivalMultiplier: 1.0, consumptionKwh: 18, seed: 42 };

export default function ConcurrencyChart({ className }: Props) {
  const data = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => {
      const n = i + 1;
      const result = simulate({ ...BASELINE_PARAMS, numChargepoints: n, chargingPowerKw: 11 });
      return { n, concurrency: Math.round(result.concurrencyFactor * 1000) / 10 };
    }),
    [],
  );

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm ${className ?? ""}`}>
      <div className="mb-6 space-y-1">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Concurrency Factor
        </h2>
        <p className="text-xs text-stone-400">
          How concurrency changes as chargepoint count increases (1–30, 11 kW each)
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 20, left: 0 }}>
          <XAxis
            dataKey="n"
            tick={{ fontSize: 11, fill: "#a8a29e" }}
            tickLine={false}
            axisLine={false}
            label={{ value: "Chargepoints", position: "insideBottom", offset: -2, fontSize: 11, fill: "#a8a29e" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#a8a29e" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
            width={45}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Concurrency"]}
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", fontSize: "12px" }}
          />
          <Line
            type="monotone"
            dataKey="concurrency"
            stroke="#065f46"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
