"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  Play,
  RotateCcw
} from "lucide-react";

// Mock data fallbacks matching the FastAPI responses
const DEFAULT_METRICS = {
  total_predictions: 124802,
  avg_delay_reduction_mins: 14.8,
  punctuality_rate: 92.4,
  delay_variance_mins: 2.1,
  rmse: 4.25,
  r2_score: 0.89,
  mape: 8.7,
  network_efficiency_index: 88.5
};

const DEFAULT_CORRIDORS = [
  { corridor: "Berlin - Paris", avg_delay: "14m 12s", efficiency: 92, traffic_load: 78.5, trend: "down", status: "OPTIMAL" },
  { corridor: "Warsaw - Hamburg", avg_delay: "08m 42s", efficiency: 96, traffic_load: 65.2, trend: "down", status: "OPTIMAL" },
  { corridor: "Rotterdam - Genoa", avg_delay: "38m 25s", efficiency: 68, traffic_load: 94.1, trend: "up", status: "MONITOR" },
  { corridor: "Paris - Milan", avg_delay: "11m 30s", efficiency: 89, traffic_load: 74.8, trend: "stable", status: "OPTIMAL" },
  { corridor: "Vienna - Budapest", avg_delay: "05m 15s", efficiency: 98, traffic_load: 42.0, trend: "down", status: "OPTIMAL" },
  { corridor: "Munich - Verona", avg_delay: "49m 10s", efficiency: 48, traffic_load: 99.2, trend: "up", status: "CONGESTED" }
];

const DEFAULT_TRENDS = [
  { month: "Jan", actual: 15.2, predicted: 14.8 },
  { month: "Feb", actual: 14.1, predicted: 14.5 },
  { month: "Mar", actual: 16.8, predicted: 16.2 },
  { month: "Apr", actual: 18.5, predicted: 18.1 },
  { month: "May", actual: 12.9, predicted: 13.3 },
  { month: "Jun", actual: 11.4, predicted: 11.2 },
  { month: "Jul", actual: 10.8, predicted: 10.9 },
  { month: "Aug", actual: 12.1, predicted: 11.8 },
  { month: "Sep", actual: 14.5, predicted: 14.9 },
  { month: "Oct", actual: 15.9, predicted: 15.6 },
  { month: "Nov", actual: 17.2, predicted: 16.8 },
  { month: "Dec", actual: 19.4, predicted: 18.9 }
];

const LIVE_FEED = [
  { id: "CR-442", name: "Iron Ore Express", from: "Warsaw", to: "Hamburg", status: "ON TIME", time: "ETA 14:30 (Today)", cargo: "Raw Mineral" },
  { id: "CR-901", name: "Rotterdam Cement Carrier", from: "Rotterdam", to: "Genoa", status: "DELAYED", time: "ETA 19:15 (+32m)", cargo: "Dry Bulk Cement" },
  { id: "CR-112", name: "Automotive Carrier Grid A", from: "Munich", to: "Verona", status: "DELAYED", time: "ETA 22:45 (+49m)", cargo: "European Vehicles" },
  { id: "CR-305", name: "Intermodal Container Train", from: "Berlin", to: "Paris", status: "ON TIME", time: "ETA 06:15 (Tomorrow)", cargo: "Mixed Goods" }
];

export default function ExecutiveDashboard() {
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const [corridors, setCorridors] = useState(DEFAULT_CORRIDORS);
  const [trends, setTrends] = useState(DEFAULT_TRENDS);
  const [loading, setLoading] = useState(true);
  const [activeSync, setActiveSync] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://127.0.0.1:8000/analytics-summary");
        if (res.ok) {
          const data = await res.json();
          setMetrics(data.metrics);
          setCorridors(data.corridors);
          setTrends(data.monthly_trends);
        }
      } catch (err) {
        console.log("FastAPI backend offline, running on high-fidelity mock datasets.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-text-primary font-serif">
            Executive Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time predictive logistics intelligence for Trans-European railway networks.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-brand-blue-light dark:bg-brand-blue-light/10 border border-border-primary rounded text-[10px] font-semibold">
            <span className={`w-2 h-2 rounded-full ${activeSync ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span className="text-text-primary/80">AUTO-SYNC ACTIVE</span>
          </div>
          <button 
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 500);
            }}
            className="p-1 rounded bg-bg-card border border-border-primary hover:bg-slate-100 dark:hover:bg-brand-blue-light/5 text-brand-blue dark:text-brand-accent-blue"
            title="Recalibrate Stats"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            title: "AVG. DELAY REDUCTION", 
            value: `${metrics.avg_delay_reduction_mins}m`, 
            sub: "+4.2% efficiency", 
            barVal: 78, 
            color: "bg-brand-blue",
            textColor: "text-brand-blue dark:text-brand-accent-blue"
          },
          { 
            title: "PUNCTUALITY RATE", 
            value: `${metrics.punctuality_rate}%`, 
            sub: "+1.5% accuracy", 
            barVal: 92, 
            color: "bg-brand-green",
            textColor: "text-brand-green"
          },
          { 
            title: "MODEL ERROR (RMSE)", 
            value: `${metrics.rmse}m`, 
            sub: "-0.8% variance", 
            barVal: 15, 
            color: "bg-brand-saffron",
            textColor: "text-brand-saffron"
          },
          { 
            title: "NETWORK EFFECTIVENESS", 
            value: `${metrics.network_efficiency_index}%`, 
            sub: "Optimal load", 
            barVal: 88, 
            color: "bg-brand-blue",
            textColor: "text-brand-blue dark:text-brand-accent-blue"
          }
        ].map((card, i) => (
          <div 
            key={i} 
            className="p-4 rounded-xl border border-border-primary bg-bg-card shadow-sm flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-300"
          >
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-bold text-slate-500 tracking-wider">{card.title}</span>
              <span className="text-[9px] text-brand-green font-bold">{card.sub}</span>
            </div>
            
            <div className="my-3">
              <span className={`text-2xl font-black ${card.textColor}`}>{card.value}</span>
            </div>

            {/* Status bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`${card.color} h-1.5 rounded-full`}
                style={{ width: `${card.barVal}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts & Feed Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Delay Trends Chart Panel */}
        <div className="xl:col-span-8 p-5 rounded-xl border border-border-primary bg-bg-card shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b border-border-primary pb-2">
            <div>
              <h3 className="text-sm font-bold text-text-primary font-serif">Freight Delay Variance Trends</h3>
              <p className="text-[10px] text-slate-500">Aggregated predicted vs actual arrival delay across TEN-T European networks</p>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-semibold">
              <span className="px-2 py-0.5 rounded bg-brand-blue-light dark:bg-brand-blue-light/10 border border-border-primary text-brand-blue dark:text-brand-accent-blue">ACTUAL TIME</span>
              <span className="px-2 py-0.5 rounded bg-brand-saffron/10 border border-brand-saffron/20 text-[#ea580c] dark:text-[#f97316]">AI ESTIMATE</span>
            </div>
          </div>

          <div className="h-64 w-full text-slate-500 text-xs">
            {loading ? (
              <div className="h-full flex items-center justify-center text-[11px] font-semibold">CALCULATING CHART ARRAYS...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" />
                  <XAxis dataKey="month" stroke="var(--brand-silver)" style={{ fontSize: '10px' }} />
                  <YAxis stroke="var(--brand-silver)" style={{ fontSize: '10px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "var(--card-bg)", borderColor: "var(--brand-border)", color: "var(--foreground)" }}
                    labelStyle={{ fontSize: "10px", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
                  <Area type="monotone" dataKey="predicted" stroke="#ea580c" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Live Freight Feed Panel */}
        <div className="xl:col-span-4 p-5 rounded-xl border border-border-primary bg-bg-card shadow-sm flex flex-col justify-between">
          <div className="border-b border-border-primary pb-2 mb-3">
            <h3 className="text-sm font-bold text-text-primary font-serif">Live Freight Tracking Feed</h3>
            <p className="text-[10px] text-slate-500">Simulated satellite synchronization stream</p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-64 pr-1">
            {LIVE_FEED.map((feed, i) => (
              <div 
                key={i}
                className="p-2.5 rounded border border-border-primary bg-bg-primary flex items-center justify-between text-xs hover:border-brand-blue/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-brand-blue-light dark:bg-brand-blue-light/20 text-brand-blue dark:text-brand-accent-blue text-[9px] font-bold border border-brand-blue/20">
                      {feed.id}
                    </span>
                    <span className="font-bold text-text-primary text-[11px] font-serif">{feed.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400">
                    From: <span className="text-text-primary font-bold">{feed.from}</span> → To: <span className="text-text-primary font-bold">{feed.to}</span>
                  </div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400">
                    Cargo: {feed.cargo} • {feed.time}
                  </div>
                </div>

                <div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                    feed.status === "ON TIME" 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-brand-green" 
                      : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                  }`}>
                    {feed.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-border-primary mt-2 text-center">
            <Link 
              href="/control-room" 
              className="text-[10px] font-bold text-brand-blue dark:text-brand-accent-blue hover:underline transition-colors inline-flex items-center gap-1"
            >
              <span>ACCESS FULL LIVE MAP CONTROL ROOM</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* European Corridors Grid Table */}
      <div className="p-5 rounded-xl border border-border-primary bg-bg-card shadow-sm">
        <div className="border-b border-border-primary pb-2 mb-4">
          <h3 className="text-sm font-bold text-text-primary font-serif">Trans-European Corridors Performance</h3>
          <p className="text-[10px] text-slate-500">Detailed efficiency logs across primary cargo transit channels</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-primary text-slate-500 text-[10px] font-bold">
                <th className="py-2.5">RAILWAY CORRIDOR</th>
                <th className="py-2.5">AVG ESTIMATED DELAY</th>
                <th className="py-2.5 text-center">ROUTE EFFICIENCY INDEX</th>
                <th className="py-2.5 text-center">TRAFFIC CAPACITY</th>
                <th className="py-2.5 text-right">GRID LEVEL STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/30 text-slate-700 dark:text-slate-300">
              {corridors.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-brand-blue-light/5 transition-colors">
                  <td className="py-3 font-bold text-text-primary font-serif">{row.corridor}</td>
                  <td className="py-3 font-semibold text-brand-blue dark:text-brand-accent-blue">{row.avg_delay}</td>
                  <td className="py-3">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-20 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-brand-blue h-1.5" style={{ width: `${row.efficiency}%` }}></div>
                      </div>
                      <span className="font-bold text-[11px]">{row.efficiency}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-center font-bold text-text-primary">{row.traffic_load}%</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                      row.status === "OPTIMAL" 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-brand-green" 
                        : row.status === "MONITOR" 
                        ? "bg-brand-saffron/10 border-brand-saffron/30 text-[#ea580c] dark:text-brand-saffron" 
                        : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
