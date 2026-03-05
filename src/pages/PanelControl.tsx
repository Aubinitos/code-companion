import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { getSystemStatus } from "@/lib/mockData";

type PanelMode = 'flat' | 'tilted' | 'auto';

const PanelControl = () => {
  const status = getSystemStatus();
  const [mode, setMode] = useState<PanelMode>(status.mode);
  const [panAngle, setPanAngle] = useState(status.panAngle);
  const [tiltAngle, setTiltAngle] = useState(status.tiltAngle);

  const modes: { value: PanelMode; label: string; description: string }[] = [
    { value: 'flat', label: 'À plat (0°)', description: 'Panneau horizontal, position de repos' },
    { value: 'tilted', label: '53° Sud', description: 'Position fixe inclinée à 53° face au sud' },
    { value: 'auto', label: 'Automatique', description: 'Suivi automatique de la position du soleil' },
  ];

  const handleManualMove = (direction: string) => {
    switch (direction) {
      case 'up': setTiltAngle(prev => Math.min(prev + 5, 90)); break;
      case 'down': setTiltAngle(prev => Math.max(prev - 5, 0)); break;
      case 'left': setPanAngle(prev => Math.max(prev - 5, 0)); break;
      case 'right': setPanAngle(prev => Math.min(prev + 5, 180)); break;
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Pilotage du panneau</h1>
        <p className="mt-1 text-muted-foreground">Configuration du mode de fonctionnement et contrôle manuel</p>
      </motion.div>

      {/* Mode Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Mode de fonctionnement</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {modes.map(m => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`rounded-xl border-2 p-5 text-left transition-all duration-300 ${
                mode === m.value
                  ? 'border-primary glow-amber bg-primary/5'
                  : 'border-border bg-secondary hover:border-muted-foreground/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className={`h-6 w-6 ${mode === m.value ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-base font-semibold ${mode === m.value ? 'text-primary' : 'text-foreground'}`}>
                  {m.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Current Position & Manual Control */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Position Display */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">Position actuelle</h2>
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Orientation (Pan)</span>
                <span className="font-mono text-primary">{panAngle}°</span>
              </div>
              <div className="h-3 rounded-full bg-secondary">
                <div className="h-3 rounded-full gradient-solar transition-all duration-500" style={{ width: `${(panAngle / 180) * 100}%` }} />
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>Est (0°)</span><span>Sud (90°)</span><span>Ouest (180°)</span>
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Inclinaison (Tilt)</span>
                <span className="font-mono text-primary">{tiltAngle}°</span>
              </div>
              <div className="h-3 rounded-full bg-secondary">
                <div className="h-3 rounded-full gradient-solar transition-all duration-500" style={{ width: `${(tiltAngle / 90) * 100}%` }} />
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>Horizontal (0°)</span><span>Vertical (90°)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Manual Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">Contrôle manuel</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {mode === 'auto' ? "Désactivez le mode automatique pour utiliser le contrôle manuel." : "Utilisez les flèches pour déplacer le panneau."}
          </p>
          <div className="flex flex-col items-center gap-2">
            <button onClick={() => handleManualMove('up')} disabled={mode === 'auto'}
              className="rounded-lg bg-secondary p-3 text-foreground transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowUp className="h-6 w-6" />
            </button>
            <div className="flex gap-2">
              <button onClick={() => handleManualMove('left')} disabled={mode === 'auto'}
                className="rounded-lg bg-secondary p-3 text-foreground transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed">
                <ArrowLeft className="h-6 w-6" />
              </button>
              <button onClick={() => { setPanAngle(90); setTiltAngle(0); }} disabled={mode === 'auto'}
                className="rounded-lg bg-secondary p-3 text-foreground transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed">
                <RotateCcw className="h-6 w-6" />
              </button>
              <button onClick={() => handleManualMove('right')} disabled={mode === 'auto'}
                className="rounded-lg bg-secondary p-3 text-foreground transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed">
                <ArrowRight className="h-6 w-6" />
              </button>
            </div>
            <button onClick={() => handleManualMove('down')} disabled={mode === 'auto'}
              className="rounded-lg bg-secondary p-3 text-foreground transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowDown className="h-6 w-6" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Capteurs luminosité */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Capteurs de luminosité (4 phototransistors)</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {['Nord', 'Sud', 'Est', 'Ouest'].map((dir, i) => {
            const val = Math.round(200 + Math.random() * 800);
            return (
              <div key={dir} className="stat-card text-center">
                <p className="text-sm text-muted-foreground">{dir}</p>
                <p className="mt-2 text-2xl font-bold font-mono text-primary">{val}</p>
                <p className="text-xs text-muted-foreground">lux</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default PanelControl;
