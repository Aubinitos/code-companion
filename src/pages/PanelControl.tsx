import { useState } from "react";
import { Sun, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { PageHeader, ChartCard } from "@/components/shared";
import { getSystemStatus } from "@/lib/mockData";

type PanelMode = 'flat' | 'tilted' | 'auto';

const MODES: { value: PanelMode; label: string; desc: string }[] = [
  { value: 'flat', label: 'À plat (0°)', desc: 'Panneau horizontal' },
  { value: 'tilted', label: '53° Sud', desc: 'Incliné à 53° face au sud' },
  { value: 'auto', label: 'Automatique', desc: 'Suivi du soleil' },
];

const PanelControl = () => {
  const status = getSystemStatus();
  const [mode, setMode] = useState<PanelMode>(status.mode);
  const [panAngle, setPanAngle] = useState(status.panAngle);
  const [tiltAngle, setTiltAngle] = useState(status.tiltAngle);
  const disabled = mode === 'auto';

  const move = (dir: string) => {
    if (dir === 'up') setTiltAngle(p => Math.min(p + 5, 90));
    else if (dir === 'down') setTiltAngle(p => Math.max(p - 5, 0));
    else if (dir === 'left') setPanAngle(p => Math.max(p - 5, 0));
    else setPanAngle(p => Math.min(p + 5, 180));
  };

  const Btn = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
    <button onClick={onClick} disabled={disabled}
      className="rounded border border-border bg-secondary p-2 hover:bg-primary hover:text-primary-foreground disabled:opacity-30">
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Pilotage du panneau" subtitle="Mode de fonctionnement et contrôle manuel" />

      <ChartCard title="Mode de fonctionnement">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {MODES.map(m => (
            <button key={m.value} onClick={() => setMode(m.value)}
              className={`rounded border-2 p-4 text-left ${
                mode === m.value ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground'
              }`}>
              <p className="font-semibold">{m.label}</p>
              <p className="text-sm text-muted-foreground">{m.desc}</p>
            </button>
          ))}
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Position actuelle">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Orientation (Pan)</span><span className="font-bold">{panAngle}°</span>
              </div>
              <div className="h-3 rounded bg-secondary">
                <div className="h-3 rounded bg-primary" style={{ width: `${(panAngle / 180) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Inclinaison (Tilt)</span><span className="font-bold">{tiltAngle}°</span>
              </div>
              <div className="h-3 rounded bg-secondary">
                <div className="h-3 rounded bg-primary" style={{ width: `${(tiltAngle / 90) * 100}%` }} />
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Contrôle manuel">
          <p className="mb-3 text-sm text-muted-foreground">
            {disabled ? "Désactivez le mode auto pour le contrôle manuel." : "Utilisez les flèches pour déplacer le panneau."}
          </p>
          <div className="flex flex-col items-center gap-1">
            <Btn onClick={() => move('up')}><ArrowUp className="h-5 w-5" /></Btn>
            <div className="flex gap-1">
              <Btn onClick={() => move('left')}><ArrowLeft className="h-5 w-5" /></Btn>
              <Btn onClick={() => { setPanAngle(90); setTiltAngle(0); }}><RotateCcw className="h-5 w-5" /></Btn>
              <Btn onClick={() => move('right')}><ArrowRight className="h-5 w-5" /></Btn>
            </div>
            <Btn onClick={() => move('down')}><ArrowDown className="h-5 w-5" /></Btn>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Capteurs de luminosité">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {['Nord', 'Sud', 'Est', 'Ouest'].map(dir => (
            <div key={dir} className="rounded border border-border bg-card p-3 text-center">
              <p className="text-sm text-muted-foreground">{dir}</p>
              <p className="text-xl font-bold text-accent">{Math.round(200 + Math.random() * 800)} lux</p>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export default PanelControl;
