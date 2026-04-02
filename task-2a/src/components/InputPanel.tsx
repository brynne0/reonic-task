import { useRef, useCallback } from "react";
import { Zap, Car, BatteryCharging, EvCharger } from "lucide-react";

interface Props {
  numChargepoints: number;
  arrivalMultiplier: number;
  consumptionKwh: number;
  chargingPowerKw: number;
  onChange: (key: string, value: number) => void;
}

export default function InputPanel({
  numChargepoints,
  arrivalMultiplier,
  consumptionKwh,
  chargingPowerKw,
  onChange,
}: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 space-y-5 shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
        Configuration
      </h2>

      <Slider
        icon={<EvCharger size={15} />}
        label="Charge Points"
        value={numChargepoints}
        min={1}
        max={30}
        step={1}
        display={String(numChargepoints)}
        onChange={(v) => onChange("numChargepoints", v)}
      />
      <Slider
        icon={<Zap size={15} />}
        label="Arrival Multiplier"
        value={arrivalMultiplier}
        min={0.2}
        max={2.0}
        step={0.01}
        display={`${Math.round(arrivalMultiplier * 100)}%`}
        onChange={(v) => onChange("arrivalMultiplier", v)}
      />
      <Slider
        icon={<Car size={15} />}
        label="Car Consumption"
        value={consumptionKwh}
        min={10}
        max={30}
        step={1}
        display={`${consumptionKwh} kWh/100km`}
        onChange={(v) => onChange("consumptionKwh", v)}
      />
      <Slider
        icon={<BatteryCharging size={15} />}
        label="Charging Power"
        value={chargingPowerKw}
        min={3.7}
        max={50}
        step={0.1}
        display={`${chargingPowerKw.toFixed(1)} kW`}
        onChange={(v) => onChange("chargingPowerKw", v)}
      />
    </div>
  );
}

interface SliderProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}

function Slider({
  icon,
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const getValueFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return value;
      const { left, width } = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - left) / width));
      const raw = min + ratio * (max - min);
      const stepped = Math.round(raw / step) * step;
      return Math.max(min, Math.min(max, Number(stepped.toFixed(10))));
    },
    [min, max, step, value],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onChange(getValueFromClientX(e.clientX));

      const handleMouseMove = (e: MouseEvent) =>
        onChange(getValueFromClientX(e.clientX));
      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [getValueFromClientX, onChange],
  );

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-stone-500">
          <span className="text-emerald-800">{icon}</span>
          {label}
        </span>
        <span className="font-semibold text-emerald-900">{display}</span>
      </div>
      <div
        ref={trackRef}
        className="relative h-1.5 bg-stone-200 rounded-full cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute h-full bg-emerald-800 rounded-full pointer-events-none"
          style={{ width: `${percent}%` }}
        />
        <div
          className="absolute top-1/2 w-4 h-4 bg-emerald-800 rounded-full shadow-md pointer-events-none -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${percent}%` }}
        />
      </div>
    </div>
  );
}
