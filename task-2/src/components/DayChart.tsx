import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  exemplaryDayPower: number[];
  className?: string;
}

export default function DayChart({ exemplaryDayPower, className }: Props) {
  const data = exemplaryDayPower.map((kw, i) => ({
    time: tickToTime(i),
    kw: Math.round(kw * 10) / 10,
  }));

  const xTicks = Array.from({ length: 12 }, (_, i) => tickToTime(i * 8));

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm ${className ?? ""}`}>
      <div className="mb-6 space-y-1">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Exemplary Day
        </h2>
        <p className="text-xs text-stone-400 ">
          Simulated power demand (kW) averaged across all days of the year
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#065f46" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#065f46" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: "#a8a29e" }}
            tickLine={false}
            axisLine={false}
            ticks={xTicks}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#a8a29e" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}kW`}
            width={45}
          />
          <Tooltip
            formatter={(value) => [`${value} kW`, "Power"]}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="kw"
            stroke="#065f46"
            strokeWidth={2}
            fill="url(#powerGradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function tickToTime(tick: number): string {
  const totalMinutes = tick * 15;
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}
