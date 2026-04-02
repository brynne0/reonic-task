import { Plus, Trash2 } from "lucide-react";
import type { ChargePointGroup } from "../simulation/simulate";

interface Props {
  groups: ChargePointGroup[];
  onChange: (groups: ChargePointGroup[]) => void;
}

const POWER_OPTIONS = [3.7, 7.4, 11, 22, 50, 150];

export default function ChargeGroupPanel({ groups, onChange }: Props) {
  const total = groups.reduce((sum, g) => sum + g.count, 0);

  function addGroup() {
    onChange([...groups, { count: 1, powerKw: 11 }]);
  }

  function removeGroup(i: number) {
    onChange(groups.filter((_, idx) => idx !== i));
  }

  function updateGroup(i: number, patch: Partial<ChargePointGroup>) {
    onChange(groups.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
  }

  return (
    <div className="bg-white rounded-2xl p-6 space-y-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          Chargepoint Groups
        </h2>
        <span className="text-xs text-stone-400">{total} total</span>
      </div>

      <div className="space-y-3">
        {groups.map((group, i) => (
          <div key={i} className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={50}
              value={group.count}
              onChange={(e) =>
                updateGroup(i, { count: Math.max(1, Number(e.target.value)) })
              }
              className="w-16 text-center border border-stone-200 rounded-lg py-1.5 text-sm font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
            <span className="text-stone-400 text-sm">×</span>
            <select
              value={group.powerKw}
              onChange={(e) =>
                updateGroup(i, { powerKw: Number(e.target.value) })
              }
              className="flex-1 border border-stone-200 rounded-lg py-1.5 px-2 text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
            >
              {POWER_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p} kW
                </option>
              ))}
            </select>
            <button
              onClick={() => removeGroup(i)}
              disabled={groups.length === 1}
              className="text-stone-300 hover:text-red-400 disabled:opacity-30 transition-colors cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addGroup}
        className="flex items-center gap-2 text-xs text-emerald-800 font-semibold hover:text-emerald-700 transition-colors cursor-pointer"
      >
        <Plus size={14} />
        Add group
      </button>

      <div className="bg-emerald-900/10 rounded-xl p-4 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-900">
          Theoretical Peak
        </p>
        <p className="text-2xl font-bold text-emerald-900">
          {groups.reduce((sum, g) => sum + g.count * g.powerKw, 0).toFixed(1)}{" "}
          kW
        </p>
        <p className="text-xs text-stone-400">across {total} chargepoints</p>
      </div>
    </div>
  );
}
