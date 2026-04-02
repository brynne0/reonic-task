import { Zap, Activity, TrendingUp, Calendar } from "lucide-react";

interface Props {
  totalEnergyKwh: number;
  theoreticalMaxPowerKw: number;
  actualMaxPowerKw: number;
  concurrencyFactor: number;
  chargingEvents: number;
}

export default function StatsPanel({
  totalEnergyKwh,
  theoreticalMaxPowerKw,
  actualMaxPowerKw,
  concurrencyFactor,
  chargingEvents,
}: Props) {
  const eventsBreakdown = [
    { label: "Year", value: Math.round(chargingEvents) },
    { label: "Month", value: Math.round(chargingEvents / 12) },
    { label: "Week", value: Math.round(chargingEvents / 52) },
    { label: "Day", value: Math.round(chargingEvents / 365) },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        icon={<Zap size={15} />}
        label="Total Energy"
        value={`${(totalEnergyKwh / 1000).toFixed(1)} MWh`}
        sub="charged per year"
      />

      <div className="bg-emerald-900/10 rounded-xl p-4 shadow-sm space-y-1">
        <div className="flex items-center gap-2 text-emerald-900">
          <Activity size={15} />
          <p className="text-xs font-semibold uppercase tracking-widest">
            Peak Power
          </p>
        </div>
        <p className="text-2xl font-bold text-emerald-900">
          {Math.round(actualMaxPowerKw)} kW
        </p>
        <div className="w-full bg-emerald-900/10 rounded-full h-1.5 mt-2">
          <div
            className="bg-emerald-800 h-1.5 rounded-full"
            style={{
              width: `${(actualMaxPowerKw / theoreticalMaxPowerKw) * 100}%`,
            }}
          />
        </div>
        <p className="text-xs text-emerald-800/60">
          {((actualMaxPowerKw / theoreticalMaxPowerKw) * 100).toFixed(0)}% of{" "}
          {Math.round(theoreticalMaxPowerKw)} kW capacity
        </p>
      </div>

      <StatCard
        icon={<TrendingUp size={15} />}
        label="Concurrency Factor"
        value={`${(concurrencyFactor * 100).toFixed(1)}%`}
        sub="chargepoints active at peak"
      />

      <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-stone-400">
          <span className="text-emerald-800">
            <Calendar size={15} />
          </span>
          <p className="text-xs font-semibold uppercase tracking-widest">
            Charging Events
          </p>
        </div>
        <div className="space-y-1.5">
          {eventsBreakdown.map(({ label, value }) => (
            <div key={label} className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-stone-800 w-12">
                {value.toLocaleString()}
              </span>
              <span className="text-xs text-stone-400">/ {label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}

function StatCard({ icon, label, value, sub }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm space-y-1">
      <div className="flex items-center gap-2 text-stone-400">
        <span className="text-emerald-800">{icon}</span>
        <p className="text-xs font-semibold uppercase tracking-widest">
          {label}
        </p>
      </div>
      <p className="text-2xl font-bold text-stone-800">{value}</p>
      <p className="text-xs text-stone-400">{sub}</p>
    </div>
  );
}
