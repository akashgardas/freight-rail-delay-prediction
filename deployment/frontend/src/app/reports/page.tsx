"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  Settings, 
  History, 
  CheckCircle,
  FileCheck,
  Zap
} from "lucide-react";

const HISTORY_LOGS = [
  { id: "TR-9081", corridor: "Berlin - Paris", weight: "4,200 T", distance: "450 KM", depDelay: "20m", predDelay: "38.5m", severity: "High", confidence: "94.2%" },
  { id: "TR-1024", corridor: "Warsaw - Hamburg", weight: "3,800 T", distance: "620 KM", depDelay: "05m", predDelay: "08.7m", severity: "Low", confidence: "98.4%" },
  { id: "TR-4560", corridor: "Rotterdam - Genoa", weight: "6,500 T", distance: "1,100 KM", depDelay: "45m", predDelay: "52.4m", severity: "High", confidence: "91.8%" },
  { id: "TR-2291", corridor: "Paris - Milan", weight: "5,100 T", distance: "780 KM", depDelay: "12m", predDelay: "16.8m", severity: "Medium", confidence: "96.5%" },
  { id: "TR-8802", corridor: "Vienna - Budapest", weight: "2,900 T", distance: "240 KM", depDelay: "00m", predDelay: "05.2m", severity: "Low", confidence: "99.1%" },
  { id: "TR-3419", corridor: "Munich - Verona", weight: "4,400 T", distance: "380 KM", depDelay: "35m", predDelay: "42.1m", severity: "Medium", confidence: "93.4%" }
];

export default function ReportsPage() {
  const [corridor, setCorridor] = useState("ALL");
  const [reportType, setReportType] = useState("COMPREHENSIVE");
  const [compiling, setCompiling] = useState(false);
  const [compileProgress, setCompileProgress] = useState(0);
  const [generatedPdf, setGeneratedPdf] = useState(false);

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setCompiling(true);
    setCompileProgress(0);
    setGeneratedPdf(false);

    // Simulate PDF compile latency
    const interval = setInterval(() => {
      setCompileProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCompiling(false);
          setGeneratedPdf(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleDownloadPdf = () => {
    alert("Initiating secure encrypted PDF download of CargoETA Rail Operations Report.");
    // Simulate downloading by creating mock content
    const blob = new Blob([`CargoETA Operations Report\nCorridor: ${corridor}\nCompile Date: ${new Date().toISOString()}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `CargoETA_Report_${corridor}_${new Date().toISOString().split('T')[0]}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-wide text-text-primary font-serif flex items-center gap-2">
          <FileText className="text-brand-saffron" />
          <span>FROIS PDF Compilation & Reports</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-serif">
          Generate official logistics arrival delay audits. Compile historical and predictive model parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Report Compiler Form: Left (5/12) */}
        <div className="lg:col-span-5 p-5 rounded-xl border border-border-primary bg-bg-card shadow-sm space-y-5">
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-blue dark:text-brand-accent-blue border-b border-border-primary pb-2">
            <Settings size={14} className="text-brand-saffron" />
            <span>REPORT CONFIGURATION DECK</span>
          </div>

          <form onSubmit={handleGenerateReport} className="space-y-4">
            
            {/* Corridor selector */}
            <div className="space-y-1.5 text-xs">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Corridor Select</label>
              <select 
                value={corridor}
                onChange={(e) => setCorridor(e.target.value)}
                className="w-full bg-bg-primary border border-border-primary rounded p-2 text-xs text-text-primary focus:outline-none focus:border-brand-blue"
              >
                <option value="ALL">All Trans-European Networks</option>
                <option value="BER-PAR">Berlin - Paris Corridor</option>
                <option value="ROT-GEN">Rotterdam - Genoa Trunk Line</option>
                <option value="MUN-VER">Munich - Verona Alps Crossing</option>
              </select>
            </div>

            {/* Scope select */}
            <div className="space-y-1.5 text-xs">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Report Scope</label>
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-bg-primary border border-border-primary rounded p-2 text-xs text-text-primary focus:outline-none focus:border-brand-blue"
              >
                <option value="COMPREHENSIVE">Comprehensive (Historical + SHAP Explainability)</option>
                <option value="PREDICTIONS-ONLY">Short-term Predictions Telemetry logs</option>
                <option value="SHAP-ONLY">SHAP Global Feature Importance Audits</option>
              </select>
            </div>

            {/* Submit compile button */}
            <button 
              type="submit"
              disabled={compiling}
              className="w-full py-2.5 rounded bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-bold tracking-wider uppercase cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
            >
              {compiling ? "Compiling PDF Vectors..." : "Compile Official Report"}
            </button>
          </form>

          {/* Compilation progress bar */}
          {compiling && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Rendering LaTex grids...</span>
                <span>{compileProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden border border-border-primary">
                <div className="bg-brand-saffron h-full transition-all duration-150" style={{ width: `${compileProgress}%` }}></div>
              </div>
            </div>
          )}

          {/* Download ready widget */}
          {generatedPdf && !compiling && (
            <div className="p-3.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs text-text-primary space-y-2">
              <div className="flex items-center space-x-1.5 text-brand-green font-bold font-serif">
                <FileCheck size={14} />
                <span>REPORT COMPILE COMPLETED (PDF)</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Audit file compiled. Standard security checksum: <span className="text-text-primary font-bold">SHA-256 / B8A3E7</span>
              </p>
              <button 
                onClick={handleDownloadPdf}
                className="w-full py-2 bg-brand-green hover:bg-brand-green/90 text-white font-bold font-serif text-center rounded border border-brand-green cursor-pointer text-[10px] uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
              >
                <Download size={12} />
                <span>Download Compiled PDF</span>
              </button>
            </div>
          )}
        </div>

        {/* Prediction Logs Table: Right (7/12) */}
        <div className="lg:col-span-7 p-5 rounded-xl border border-border-primary bg-bg-card shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-blue dark:text-brand-accent-blue border-b border-border-primary pb-2 mb-4">
            <History size={14} className="text-brand-saffron" />
            <span>PREDICTION AUDIT LOGS</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-primary text-slate-500 text-[9px] font-bold">
                  <th className="py-2.5">TRAIN ID</th>
                  <th className="py-2.5">CORRIDOR</th>
                  <th className="py-2.5">TONNAGE</th>
                  <th className="py-2.5">EST. DELAY</th>
                  <th className="py-2.5">CONFIDENCE</th>
                  <th className="py-2.5 text-right">AUDIT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary/30 text-slate-700 dark:text-slate-300">
                {HISTORY_LOGS.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-brand-blue-light/5 transition-colors text-[11px]">
                    <td className="py-3 font-bold text-text-primary font-serif">{log.id}</td>
                    <td className="py-3 font-serif">{log.corridor}</td>
                    <td className="py-3">{log.weight}</td>
                    <td className="py-3 font-semibold text-brand-blue dark:text-brand-accent-blue">{log.predDelay}</td>
                    <td className="py-3 text-brand-green font-bold">{log.confidence}</td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => alert(`Initiating export audit log for ${log.id}`)}
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-brand-blue-light/10 border border-border-primary text-brand-blue dark:text-brand-accent-blue cursor-pointer transition-colors"
                        title="Download Log"
                      >
                        <Download size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
