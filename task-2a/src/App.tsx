import { useMemo, useState } from "react";
import { simulate, simulateWithGroups } from "./simulation/simulate";
import type { ChargePointGroup } from "./simulation/simulate";
import InputPanel from "./components/InputPanel";
import StatsPanel from "./components/StatsPanel";
import DayChart from "./components/DayChart";
import ChargeGroupPanel from "./components/ChargeGroupPanel";
import ConcurrencyChart from "./components/ConcurrencyChart";
import { CarFront } from "lucide-react";

const DEFAULTS = {
  numChargepoints: 20,
  arrivalMultiplier: 1.0,
  consumptionKwh: 18,
  chargingPowerKw: 11,
};

const DEFAULT_GROUPS: ChargePointGroup[] = [
  { count: 5, powerKw: 11 },
  { count: 3, powerKw: 22 },
  { count: 1, powerKw: 50 },
];

type Tab = "standard" | "custom";

export default function App() {
  const [tab, setTab] = useState<Tab>("standard");
  const [params, setParams] = useState(DEFAULTS);
  const [groups, setGroups] = useState<ChargePointGroup[]>(DEFAULT_GROUPS);

  const standardResult = useMemo(
    () => simulate({ ...params, seed: 42 }),
    [params],
  );

  const customResult = useMemo(
    () =>
      simulateWithGroups(groups, {
        arrivalMultiplier: params.arrivalMultiplier,
        consumptionKwh: params.consumptionKwh,
        seed: 42,
      }),
    [groups, params.arrivalMultiplier, params.consumptionKwh],
  );

  function handleChange(key: string, value: number) {
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-8 font-sans min-w-80">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
          <h1 className="text-2xl font-semibold text-emerald-800 flex items-center gap-2">
            <CarFront />
            EV Simulator
          </h1>
          <div className="flex bg-stone-200 rounded-2xl p-1.5 gap-1 self-start sm:self-auto">
            {(["standard", "custom"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize cursor-pointer ${
                  tab === t
                    ? "bg-emerald-900 text-white shadow-sm"
                    : "text-emerald-900 hover:text-emerald-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab === "standard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[300px_1fr] gap-6 items-start">
            <InputPanel {...params} onChange={handleChange} />
            <StatsPanel {...standardResult} />
            <DayChart
              exemplaryDayPower={standardResult.exemplaryDayPower}
              className="md:col-span-2"
            />
          </div>
        )}

        {tab === "custom" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[300px_1fr] gap-6 items-start">
            <ChargeGroupPanel groups={groups} onChange={setGroups} />
            <StatsPanel {...customResult} />
            <ConcurrencyChart className="md:col-span-2" />
          </div>
        )}
      </div>
    </div>
  );
}
