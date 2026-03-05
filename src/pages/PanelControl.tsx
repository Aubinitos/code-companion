import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { PageHeader, ChartCard } from "@/components/shared";
import { getSystemStatus } from "@/lib/mockData";

type PanelMode = 'flat' | 'tilted' | 'auto';

const MODES: { value: PanelMode; label: string; desc: string }[] = [
  { value: 'flat', label: 'À plat (0°)', desc: 'Panneau horizontal, position de repos' },
  { value: 'tilted', label: '53° Sud', desc: 'Position fixe inclinée à 53° face au sud' },
  { value: 'auto', label: 'Automatique', desc: 'Suivi automatique de la position du soleil' },
];

const DirButton = ({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) => (
  <button onClick={onClick} disabled={disabled}
    className="rounded-lg bg-secondary p-3 text-foreground transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed">
    {children}
  </button>
);

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

  const bars = [
    { label: "Orientation (Pan)", value: panAngle, max: 180, marks: ["Est (0°)", "Sud (90°)", "Ouest (180°)"] },
    { label: "Inclinaison (Tilt)", value: tiltAngle, max: 90, marks: ["Horizontal (0°)", "Vertical (90°)"] },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Pilotage du panneau" subtitle="Configuration du mode de fonctionnement et contrôle manuel" />

      <ChartCard title="Mode de fonctionnement" delay={0.1}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {MODES.map(m => (
            <button key={m.value} onClick={() => setMode(m.value)}
              className={`rounded-xl border-2 p-5 text-left transition-all duration-300 ${
                mode === m.value ? 'border-primary glow-amber bg-primary/5' : 'border-border bg-secondary hover:border-muted-foreground/30'
              }`}>
              <div className="flex items-center gap-3">
                <Sun className={`h-6 w-6 ${mode === m.value ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-base font-semibold ${mode === m.value ? 'text-primary' : 'text-foreground'}`}>{m.label}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
            </button>
          ))}
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="Position actuelle" delay={0.2}>
          <div className="space-y-6">
            {bars.map(bar => (
              <div key={bar.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">{bar.label}</span>
                  <span className="font-mono text-primary">{bar.value}°</span>
                </div>
                <div className="h-3 rounded-full bg-secondary">
                  <div className="h-3 rounded-full gradient-solar transition-all duration-500" style={{ width: `${(bar.value / bar.max) * 100}%` }} />
                </div>
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  {bar.marks.map(m => <span key={m}>{m}</span>)}
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Contrôle manuel" delay={0.25}>
          <p className="mb-4 text-sm text-muted-foreground">
            {disabled ? "Désactivez le mode automatique pour utiliser le contrôle manuel." : "Utilisez les flèches pour déplacer le panneau."}
          </p>
          <div className="flex flex-col items-center gap-2">
            <DirButton onClick={() => move('up')} disabled={disabled}><ArrowUp className="h-6 w-6" /></DirButton>
            <div className="flex gap-2">
              <DirButton onClick={() => move('left')} disabled={disabled}><ArrowLeft className="h-6 w-6" /></DirButton>
              <DirButton onClick={() => { setPanAngle(90); setTiltAngle(0); }} disabled={disabled}><RotateCcw className="h-6 w-6" /></DirButton>
              <DirButton onClick={() => move('right')} disabled={disabled}><ArrowRight className="h-6 w-6" /></DirButton>
            </div>
            <DirButton onClick={() => move('down')} disabled={disabled}><ArrowDown className="h-6 w-6" /></DirButton>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Capteurs de luminosité (4 phototransistors)" delay={0.3}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {['Nord', 'Sud', 'Est', 'Ouest'].map(dir => (
            <div key={dir} className="stat-card text-center">
              <p className="text-sm text-muted-foreground">{dir}</p>
              <p className="mt-2 text-2xl font-bold font-mono text-primary">{Math.round(200 + Math.random() * 800)}</p>
              <p className="text-xs text-muted-foreground">lux</p>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export default PanelControl;
