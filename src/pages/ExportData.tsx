import { useState } from "react";
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
  const getData = () => generateHistoricalData(period);

  const doExport = (format: string) => {
    const data = getData();
    if (format === 'csv') {
      const csv = "Horodatage,V Prod,A Prod,V Cons,A Cons,CO2,PM\n" +
        data.map(d => `${d.timestamp},${d.productionVoltage},${d.productionCurrent},${d.consumptionVoltage},${d.consumptionCurrent},${d.co2},${d.microparticles}`).join("\n");
      downloadBlob(new Blob([csv], { type: "text/csv" }), `trackmysun_${period}h.csv`);
    } else if (format === 'json') {
      downloadBlob(new Blob([JSON.stringify({ system: "Track My Sun", period: `${period}h`, readings: data }, null, 2)], { type: "application/json" }), `trackmysun_${period}h.json`);
    } else {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Track My Sun - Rapport", 14, 20);
      doc.setFontSize(10);
      doc.text(`Période : ${period}h | ${new Date().toLocaleString('fr-FR')}`, 14, 28);
      autoTable(doc, {
        head: [['Heure', 'V Prod', 'A Prod', 'V Cons', 'A Cons', 'CO₂', 'PM']],
        body: data.map(d => [
          new Date(d.timestamp).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
          d.productionVoltage, d.productionCurrent, d.consumptionVoltage, d.consumptionCurrent, d.co2, d.microparticles
        ]),
        startY: 34, styles: { fontSize: 7 },
      });
      doc.save(`trackmysun_${period}h.pdf`);
    }
  };

  const previewData = getData().slice(0, 8);
  const headers = ["Heure", "V Prod", "A Prod", "V Cons", "A Cons", "CO₂", "PM"];

  return (
    <div className="space-y-6">
      <PageHeader title="Export des données" subtitle="Téléchargez les données au format PDF, CSV ou JSON" />

      <div className="flex items-center gap-3">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">Période :</span>
        <PeriodSelector period={period} onChange={setPeriod} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { format: 'pdf', label: 'PDF', icon: FileText, desc: 'Rapport formaté' },
          { format: 'csv', label: 'CSV', icon: FileSpreadsheet, desc: 'Compatible Excel' },
          { format: 'json', label: 'JSON', icon: FileJson, desc: 'Données brutes' },
        ].map(exp => (
          <button key={exp.format} onClick={() => doExport(exp.format)}
            className="rounded-lg border border-border bg-card p-6 text-center hover:bg-secondary transition-colors">
            <exp.icon className="h-10 w-10 mx-auto mb-2 text-primary" />
            <p className="font-semibold">{exp.label}</p>
            <p className="text-sm text-muted-foreground">{exp.desc}</p>
          </button>
        ))}
      </div>

      <ChartCard title="Aperçu des données">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                {headers.map(h => <th key={h} className="px-2 py-1.5 text-left text-muted-foreground">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {previewData.map((d, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="px-2 py-1.5">{new Date(d.timestamp).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</td>
                  <td className="px-2 py-1.5 text-right">{d.productionVoltage}</td>
                  <td className="px-2 py-1.5 text-right">{d.productionCurrent}</td>
                  <td className="px-2 py-1.5 text-right">{d.consumptionVoltage}</td>
                  <td className="px-2 py-1.5 text-right">{d.consumptionCurrent}</td>
                  <td className="px-2 py-1.5 text-right">{d.co2}</td>
                  <td className="px-2 py-1.5 text-right">{d.microparticles}</td>
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
