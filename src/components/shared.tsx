import { ReactNode } from "react";
import { motion } from "framer-motion";

// --- Page Header ---
export const PageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
    <h1 className="text-3xl font-bold text-foreground">{title}</h1>
    <p className="mt-1 text-muted-foreground">{subtitle}</p>
  </motion.div>
);

// --- Period Selector ---
type Period = 12 | 24 | 48;
const PERIODS: { value: Period; label: string }[] = [
  { value: 12, label: '12h' },
  { value: 24, label: '24h' },
  { value: 48, label: '48h' },
];

export const PeriodSelector = ({ period, onChange }: { period: Period; onChange: (p: Period) => void }) => (
  <div className="flex gap-2">
    {PERIODS.map(p => (
      <button key={p.value} onClick={() => onChange(p.value)}
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
          period === p.value ? 'gradient-solar text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}>
        {p.label}
      </button>
    ))}
  </div>
);

// --- Chart Card ---
export const ChartCard = ({ title, children, delay = 0 }: { title: string; children: ReactNode; delay?: number }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="rounded-xl border border-border bg-card p-6">
    <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
    {children}
  </motion.div>
);

// --- Shared Chart Styles ---
export const TOOLTIP_STYLE = {
  backgroundColor: 'hsl(220, 18%, 10%)',
  border: '1px solid hsl(220, 14%, 18%)',
  borderRadius: '8px',
  color: 'hsl(40, 20%, 92%)',
};

export const AXIS_TICK = { fill: 'hsl(220, 10%, 55%)', fontSize: 11 };
export const GRID_STROKE = "hsl(220, 14%, 18%)";

// --- Chart Colors ---
export const COLORS = {
  production: "hsl(36, 95%, 55%)",
  consumption: "hsl(0, 72%, 51%)",
  co2: "hsl(142, 71%, 45%)",
  particles: "hsl(199, 89%, 48%)",
  warning: "hsl(48, 96%, 53%)",
};
