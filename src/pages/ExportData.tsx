import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, FileSpreadsheet, FileJson, Calendar } from "lucide-react";
import { generateHistoricalData, SensorReading } from "@/lib/mockData";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ExportData = () => {
  const [period, setPeriod] = useState<12 | 24 | 48>(24);
  const [exporting, setExporting] = useState<string | null>(null);

  const getData = () => generateHistoricalData(period);

  const exportCSV = () => {
    setExporting('csv');
    const data = getData();
    const headers = "Horodatage,Tension Prod (V),Courant Prod (A),Tension Cons (V),Courant Cons (A),CO2 (ppm),Microparticules (µg/m³)\n";
    const rows = data.map(d =>
      `${d.timestamp},${d.productionVoltage},${d.productionCurrent},${d.consumptionVoltage},${d.consumptionCurrent},${d.co2},${d.microparticles}`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, `trackmysun_data_${period}h.csv`);
    setTimeout(() => setExporting(null), 1000);
  };

  const exportJSON = () => {
    setExporting('json');
    const data = getData();
    const exportData = {
      system: "Track My Sun",
      exportDate: new Date().toISOString(),
      period: `${period}h`,
      readings: data,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    downloadBlob(blob, `trackmysun_data_${period}h.json`);
    setTimeout(() => setExporting(null), 1000);
  };

  const exportPDF = () => {
    setExporting('pdf');
    const data = getData();
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Track My Sun - Rapport de données", 14, 22);
    doc.setFontSize(10);
    doc.text(`Période : ${period}h | Généré le : ${new Date().toLocaleString('fr-FR')}`, 14, 30);
    doc.text(`Nombre de mesures : ${data.length}`, 14, 36);

    const tableData = data.map(d => [
      new Date(d.timestamp).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
      d.productionVoltage.toString(),
      d.productionCurrent.toString(),
      d.consumptionVoltage.toString(),
      d.consumptionCurrent.toString(),
      d.co2.toString(),
      d.microparticles.toString(),
    ]);

    autoTable(doc, {
      head: [['Heure', 'V Prod', 'A Prod', 'V Cons', 'A Cons', 'CO₂', 'PM']],
      body: tableData,
      startY: 42,
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [217, 153, 37] },
    });

    doc.save(`trackmysun_data_${period}h.pdf`);
    setTimeout(() => setExporting(null), 1000);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const periods = [
    { value: 12 as const, label: '12h' },
    { value: 24 as const, label: '24h' },
    { value: 48 as const, label: '48h' },
  ];

  const previewData = getData().slice(0, 10);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-foreground">Export des données</h1>
        <p className="mt-1 text-muted-foreground">Téléchargez les données au format PDF, CSV ou JSON</p>
      </motion.div>

      {/* Period */}
      <div className="flex items-center gap-4">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Période :</span>
        {periods.map(p => (
          <button key={p.value} onClick={() => setPeriod(p.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${period === p.value ? 'gradient-solar text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          { format: 'pdf', label: 'Export PDF', icon: FileText, desc: 'Rapport formaté avec tableaux', action: exportPDF, color: 'text-destructive' },
          { format: 'csv', label: 'Export CSV', icon: FileSpreadsheet, desc: 'Tableur compatible Excel', action: exportCSV, color: 'text-success' },
          { format: 'json', label: 'Export JSON', icon: FileJson, desc: 'Données brutes structurées', action: exportJSON, color: 'text-info' },
        ].map(exp => (
          <motion.button
            key={exp.format}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={exp.action}
            disabled={exporting !== null}
            className="stat-card flex flex-col items-center gap-4 py-8 hover:cursor-pointer active:scale-95 transition-transform disabled:opacity-50"
          >
            <exp.icon className={`h-12 w-12 ${exp.color}`} />
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">{exp.label}</p>
              <p className="text-sm text-muted-foreground">{exp.desc}</p>
            </div>
            {exporting === exp.format && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <Download className="h-4 w-4 animate-bounce" />
                Téléchargement...
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6 overflow-x-auto">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Aperçu des données (10 premières lignes)</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left text-muted-foreground font-medium">Horodatage</th>
              <th className="px-3 py-2 text-right text-muted-foreground font-medium">V Prod</th>
              <th className="px-3 py-2 text-right text-muted-foreground font-medium">A Prod</th>
              <th className="px-3 py-2 text-right text-muted-foreground font-medium">V Cons</th>
              <th className="px-3 py-2 text-right text-muted-foreground font-medium">A Cons</th>
              <th className="px-3 py-2 text-right text-muted-foreground font-medium">CO₂</th>
              <th className="px-3 py-2 text-right text-muted-foreground font-medium">PM</th>
            </tr>
          </thead>
          <tbody>
            {previewData.map((d, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="px-3 py-2 font-mono text-foreground">{new Date(d.timestamp).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</td>
                <td className="px-3 py-2 text-right font-mono text-primary">{d.productionVoltage}</td>
                <td className="px-3 py-2 text-right font-mono text-primary">{d.productionCurrent}</td>
                <td className="px-3 py-2 text-right font-mono text-destructive">{d.consumptionVoltage}</td>
                <td className="px-3 py-2 text-right font-mono text-destructive">{d.consumptionCurrent}</td>
                <td className="px-3 py-2 text-right font-mono text-chart-co2">{d.co2}</td>
                <td className="px-3 py-2 text-right font-mono text-chart-particles">{d.microparticles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default ExportData;
