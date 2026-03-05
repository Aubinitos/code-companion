import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, FileSpreadsheet, FileJson, Calendar } from "lucide-react";
import { PageHeader, PeriodSelector, ChartCard } from "@/components/shared";
import { generateHistoricalData } from "@/lib/mockData";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  Object.assign(document.createElement('a'), { href: url, download: filename }).click();
  URL.revokeObjectURL(url);
};

const ExportData = () => {
  const [period, setPeriod] = useState<12 | 24 | 48>(24);
  const [exporting, setExporting] = useState<string | null>(null);
  const getData = () => generateHistoricalData(period);

  const doExport = (format: string) => {
    setExporting(format);
    const data = getData();

    if (format === 'csv') {
      const csv = "Horodatage,V Prod,A Prod,V Cons,A Cons,CO2,PM\n" +
        data.map(d => `${d.timestamp},${d.productionVoltage},${d.productionCurrent},${d.consumptionVoltage},${d.consumptionCurrent},${d.co2},${d.microparticles}`).join("\n");
      downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `trackmysun_${period}h.csv`);
    } else if (format === 'json') {
      downloadBlob(new Blob([JSON.stringify({ system: "Track My Sun", exportDate: new Date().toISOString(), period: `${period}h`, readings: data }, null, 2)], { type: "application/json" }), `trackmysun_${period}h.json`);
    } else {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Track My Sun - Rapport", 14, 22);
      doc.setFontSize(10);
      doc.text(`Période : ${period}h | ${new Date().toLocaleString('fr-FR')} | ${data.length} mesures`, 14, 30);
      autoTable(doc, {
        head: [['Heure', 'V Prod', 'A Prod', 'V Cons', 'A Cons', 'CO₂', 'PM']],
        body: data.map(d => [
          new Date(d.timestamp).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
          d.productionVoltage, d.productionCurrent, d.consumptionVoltage, d.consumptionCurrent, d.co2, d.microparticles
        ]),
        startY: 36, styles: { fontSize: 7, cellPadding: 2 }, headStyles: { fillColor: [217, 153, 37] },
      });
      doc.save(`trackmysun_${period}h.pdf`);
    }
    setTimeout(() => setExporting(null), 1000);
  };

  const exports = [
    { format: 'pdf', label: 'Export PDF', icon: FileText, desc: 'Rapport formaté', color: 'text-destructive' },
    { format: 'csv', label: 'Export CSV', icon: FileSpreadsheet, desc: 'Compatible Excel', color: 'text-success' },
    { format: 'json', label: 'Export JSON', icon: FileJson, desc: 'Données brutes', color: 'text-info' },
  ];

  const previewData = getData().slice(0, 10);
  const headers = ["Horodatage", "V Prod", "A Prod", "V Cons", "A Cons", "CO₂", "PM"];

  return (
    <div className="space-y-8">
      <PageHeader title="Export des données" subtitle="Téléchargez les données au format PDF, CSV ou JSON" />

      <div className="flex items-center gap-4">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Période :</span>
        <PeriodSelector period={period} onChange={setPeriod} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {exports.map(exp => (
          <motion.button key={exp.format} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => doExport(exp.format)} disabled={!!exporting}
            className="stat-card flex flex-col items-center gap-4 py-8 hover:cursor-pointer active:scale-95 transition-transform disabled:opacity-50">
            <exp.icon className={`h-12 w-12 ${exp.color}`} />
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">{exp.label}</p>
              <p className="text-sm text-muted-foreground">{exp.desc}</p>
            </div>
            {exporting === exp.format && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <Download className="h-4 w-4 animate-bounce" /> Téléchargement...
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <ChartCard title="Aperçu (10 premières lignes)" delay={0.2}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {headers.map(h => <th key={h} className="px-3 py-2 text-left text-muted-foreground font-medium">{h}</th>)}
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
        </div>
      </ChartCard>
    </div>
  );
};

export default ExportData;
