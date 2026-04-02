import { useState } from "react";
import { generateHistoricalData } from "@/lib/mockData";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ExportData = () => {
  const [period, setPeriod] = useState(24);

  const doExport = (format: string) => {
    const data = generateHistoricalData(period);
    if (format === "csv") {
      const csv = "Heure,V Prod,A Prod,V Cons,A Cons,CO2,PM\n" +
        data.map(d => `${d.timestamp},${d.productionVoltage},${d.productionCurrent},${d.consumptionVoltage},${d.consumptionCurrent},${d.co2},${d.microparticles}`).join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      a.download = `donnees_${period}h.csv`;
      a.click();
    } else if (format === "json") {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
      a.download = `donnees_${period}h.json`;
      a.click();
    } else {
      const doc = new jsPDF();
      doc.text("Track My Sun - Rapport", 14, 20);
      doc.setFontSize(10);
      doc.text(`Période : ${period}h`, 14, 28);
      autoTable(doc, {
        head: [["Heure", "V Prod", "A Prod", "V Cons", "A Cons", "CO₂", "PM"]],
        body: data.map(d => [
          new Date(d.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          d.productionVoltage, d.productionCurrent, d.consumptionVoltage, d.consumptionCurrent, d.co2, d.microparticles
        ]),
        startY: 34,
        styles: { fontSize: 7 },
      });
      doc.save(`donnees_${period}h.pdf`);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Export des données</h2>
      <div className="mb-4 flex gap-2">
        {[12, 24, 48].map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`border px-3 py-1 text-sm ${period === p ? "bg-blue-600 text-white" : ""}`}>
            {p}h
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <button onClick={() => doExport("pdf")} className="border px-4 py-2 hover:bg-gray-100">Télécharger PDF</button>
        <button onClick={() => doExport("csv")} className="border px-4 py-2 hover:bg-gray-100">Télécharger CSV</button>
        <button onClick={() => doExport("json")} className="border px-4 py-2 hover:bg-gray-100">Télécharger JSON</button>
      </div>
    </div>
  );
};

export default ExportData;
