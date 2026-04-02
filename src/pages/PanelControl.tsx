import { useState } from "react";

const PanelControl = () => {
  const [mode, setMode] = useState("auto");
  const [pan, setPan] = useState(90);
  const [tilt, setTilt] = useState(45);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Pilotage du panneau</h2>

      <div className="mb-4">
        <p className="font-semibold mb-1">Mode :</p>
        {["flat", "tilted", "auto"].map(m => (
          <label key={m} className="mr-4">
            <input type="radio" name="mode" value={m} checked={mode === m} onChange={() => setMode(m)} className="mr-1" />
            {m === "flat" ? "À plat (0°)" : m === "tilted" ? "53° Sud" : "Automatique"}
          </label>
        ))}
      </div>

      <div className="mb-4">
        <p className="font-semibold mb-1">Position actuelle :</p>
        <p>Orientation (Pan) : {pan}°</p>
        <p>Inclinaison (Tilt) : {tilt}°</p>
      </div>

      {mode !== "auto" && (
        <div className="mb-4">
          <p className="font-semibold mb-1">Contrôle manuel :</p>
          <div className="flex gap-2 mb-2">
            <button onClick={() => setTilt(t => Math.min(t + 5, 90))} className="border px-3 py-1">↑</button>
            <button onClick={() => setTilt(t => Math.max(t - 5, 0))} className="border px-3 py-1">↓</button>
            <button onClick={() => setPan(p => Math.max(p - 5, 0))} className="border px-3 py-1">←</button>
            <button onClick={() => setPan(p => Math.min(p + 5, 180))} className="border px-3 py-1">→</button>
            <button onClick={() => { setPan(90); setTilt(0); }} className="border px-3 py-1">Reset</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelControl;
