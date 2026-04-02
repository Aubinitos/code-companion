import { ReactNode } from "react";

export const PageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div>
    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
    <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
  </div>
);

type Period = 12 | 24 | 48;
export const PeriodSelector = ({ period, onChange }: { period: Period; onChange: (p: Period) => void }) => (
  <div className="flex gap-2">
    {([12, 24, 48] as Period[]).map(p => (
      <button key={p} onClick={() => onChange(p)}
        className={`rounded px-3 py-1.5 text-sm border ${
          period === p ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:bg-secondary'
        }`}>
        {p}h
      </button>
    ))}
  </div>
);

export const ChartCard = ({ title, children }: { title: string; children: ReactNode; delay?: number }) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <h2 className="mb-3 text-base font-semibold text-foreground">{title}</h2>
    {children}
  </div>
);

export const TOOLTIP_STYLE = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '4px',
  color: '#333',
};

export const AXIS_TICK = { fill: '#888', fontSize: 11 };
export const GRID_STROKE = "#eee";

export const COLORS = {
  production: "#d49520",
  consumption: "#d04040",
  co2: "#3a9a5c",
  particles: "#3a8fc2",
  warning: "#d4a520",
};
