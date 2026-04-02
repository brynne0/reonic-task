import { useMemo, useState } from "react";
import { simulate } from "./simulation/simulate";
import InputPanel from "./components/InputPanel";
import StatsPanel from "./components/StatsPanel";
import DayChart from "./components/DayChart";
import { CarFront } from "lucide-react";

const DEFAULTS = {
  numChargepoints: 20,
  arrivalMultiplier: 1.0,
  consumptionKwh: 18,
  chargingPowerKw: 11,
};

export default function App() {
  const [params, setParams] = useState(DEFAULTS);

  const result = useMemo(() => simulate({ ...params, seed: 42 }), [params]);

  function handleChange(key: string, value: number) {
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8 font-sans min-w-80">
      <div className="max-w-5xl mx-auto space-y-6 ">
        <h1 className="text-2xl font-semibold text-emerald-800 flex items-center gap-2">
          <CarFront />
          EV Simulator
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[300px_1fr] gap-6 items-start">
          <InputPanel {...params} onChange={handleChange} />
          <StatsPanel {...result} />
          <DayChart
            exemplaryDayPower={result.exemplaryDayPower}
            className="md:col-span-2"
          />
        </div>
      </div>
    </div>
  );
}
