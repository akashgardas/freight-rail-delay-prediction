"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  Map, 
  AlertTriangle, 
  Terminal, 
  Activity, 
  TrendingUp, 
  Compass, 
  Gauge, 
  Play, 
  Cpu 
} from "lucide-react";

// Dynamically import the 3D Europe Map Component to bypass SSR compiler errors in Next.js 15
const EuropeMapScene = dynamic(
  () => import("@/components/3d/EuropeMapScene"),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-full min-h-[450px] bg-bg-card rounded-xl flex items-center justify-center border border-border-primary">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-text-primary/60 font-semibold uppercase">Initializing Trans-European 3D Geospatial Map...</span>
        </div>
      </div>
    )
  }
);

// Mock system logs representing satellite telemetry stream
const INITIAL_LOGS = [
  "SYS: Connecting to Trans-European satellite sync node...",
  "SYS: Telemetry handshakes verified for 12 core hubs.",
  "GRID: Hamburg Yards reports active shunting log #FR-442.",
  "MODEL: Recalibrating delay coefficients on Rotterdam Corridor.",
  "SYS: Sec-Level-1 authentication verified for local operator.",
  "AI: LightGBM predicts Rotterdam bottleneck (+32m) with 94.2% precision.",
  "SYS: Weather warning received for Milan Alps crossing - checking snow logs."
];

export default function ControlRoomPage() {
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS);
  const [systemUptime, setSystemUptime] = useState("99.9912");
  const [gridSpeed, setGridSpeed] = useState(105);

  // Simulate scrolling live console log feed
  useEffect(() => {
    const intervals = [
      "AI: Recalibrated Warsaw-Hamburg path delay coefficient -> 0.082",
      "SYS: Satellite sync ping response: 12ms",
      "GRID: WAG-9HC locomotive #CR-901 active telemetry synced",
      "AI: Forecasted delay for Milan Alps Grid lowered by 4m",
      "SYS: Security integrity checksum verified: OK",
      "GRID: Brussels cargo terminal reports normal load levels (60%)"
    ];

    const interval = setInterval(() => {
      const randomMsg = intervals[Math.floor(Math.random() * intervals.length)];
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [`[${timestamp}] ${randomMsg}`, ...prev.slice(0, 10)]);
      
      // Jitter grid speed slightly
      setGridSpeed(prev => Math.round(prev + (Math.random() - 0.5) * 4));
      
      // Update milliseconds fraction of uptime
      setSystemUptime(`99.99${Math.floor(Math.random() * 90 + 10)}`);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 flex flex-col h-full justify-between">
      
      {/* Full screen Header and status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-text-primary font-serif flex items-center gap-2">
            <Map className="text-brand-saffron" />
            <span>FROIS Joint Control Center Room</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-serif">
            Geospatial Trans-European corridor network command center. Track delays and active rolling stock.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-[10px] font-semibold">
          <div className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <AlertTriangle size={12} className="animate-pulse" />
            <span>1 SEVERE DELAY WARNING ACTIVE (ROTTERDAM)</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: 3D Europe Map Panel (8/12) */}
        <div className="lg:col-span-8 flex flex-col h-[520px]">
          <EuropeMapScene />
        </div>

        {/* Right Side: Telemetry logs and control gauges (4/12) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          
          {/* Active Status widgets */}
          <div className="p-4 rounded-xl border border-border-primary bg-bg-card shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-brand-blue dark:text-brand-accent-blue border-b border-border-primary pb-2">
              <Activity size={14} className="text-brand-saffron" />
              <span>SYSTEM GRID TELEMETRY</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              
              {/* Average Grid Velocity */}
              <div className="p-2.5 bg-bg-primary border border-border-primary rounded">
                <span className="text-[9px] font-bold text-slate-500 tracking-wider block">
                  AVG GRID SPEED
                </span>
                <span className="text-xl font-black text-brand-saffron block mt-1">
                  {gridSpeed} <span className="text-[10px] font-bold text-slate-500">KM/H</span>
                </span>
              </div>

              {/* Secure Uptime */}
              <div className="p-2.5 bg-bg-primary border border-border-primary rounded">
                <span className="text-[9px] font-bold text-slate-500 tracking-wider block">
                  SYSTEM UPTIME
                </span>
                <span className="text-xl font-black text-brand-green block mt-1">
                  {systemUptime}%
                </span>
              </div>

            </div>

            {/* Micro progress status indicators */}
            <div className="space-y-2 text-[10px] text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Active Track Load:</span>
                <span className="text-text-primary font-bold">78.5% (OPTIMAL)</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-brand-blue h-1.5" style={{ width: "78%" }}></div>
              </div>
              <div className="flex justify-between">
                <span>Model Calibration Threshold:</span>
                <span className="text-text-primary font-bold">R² &gt; 0.85 (STABLE)</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-brand-green h-1.5" style={{ width: "89%" }}></div>
              </div>
            </div>
          </div>

          {/* Console / Satellite Log Terminal */}
          <div className="p-4 rounded-xl border border-border-primary bg-bg-card shadow-sm flex-1 flex flex-col justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-brand-blue dark:text-brand-accent-blue border-b border-border-primary pb-2 mb-2">
              <Terminal size={14} className="text-brand-saffron" />
              <span>SATELLITE SYNC CONSOLE LOGS</span>
            </div>

            {/* Scrollable logs box */}
            <div className="flex-1 min-h-[220px] max-h-[260px] overflow-y-auto bg-bg-primary border border-border-primary rounded p-2.5 text-[9px] text-slate-600 dark:text-slate-400 space-y-1.5 scrollbar-thin select-all leading-tight">
              {logs.map((log, idx) => (
                <div key={idx} className={`${
                  log.includes("AI:") ? "text-brand-saffron font-semibold" : log.includes("warning") ? "text-red-600 dark:text-red-400 font-semibold" : "text-slate-600 dark:text-slate-400"
                }`}>
                  • {log}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border-primary text-[9px] text-slate-500 text-right mt-2 uppercase font-semibold">
              CONNECTION PROTOCOL: HTTPS / TCP-SYNCED
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
