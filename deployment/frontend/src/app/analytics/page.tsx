"use client";

import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  Legend,
  Cell
} from "recharts";
import { 
  LineChart as ChartIcon, 
  SlidersHorizontal, 
  Download, 
  TrendingUp, 
  AlertTriangle,
  RotateCcw
} from "lucide-react";

// Mock database for scatter analysis (Distance vs Delay)
const SCATTER_DATA = [
  { distance: 120, delay: 5.5, severity: "Low", fill: "#15803d" },
  { distance: 250, delay: 12.0, severity: "Low", fill: "#15803d" },
  { distance: 410, delay: 28.5, severity: "Medium", fill: "#ea580c" },
  { distance: 550, delay: 18.0, severity: "Medium", fill: "#ea580c" },
  { distance: 680, delay: 52.0, severity: "High", fill: "#dc2626" },
  { distance: 820, delay: 35.4, severity: "Medium", fill: "#ea580c" },
  { distance: 980, delay: 68.0, severity: "High", fill: "#dc2626" },
  { distance: 1150, delay: 85.2, severity: "High", fill: "#dc2626" },
  { distance: 300, delay: 8.4, severity: "Low", fill: "#15803d" },
  { distance: 480, delay: 22.0, severity: "Medium", fill: "#ea580c" },
  { distance: 750, delay: 42.1, severity: "Medium", fill: "#ea580c" },
  { distance: 1300, delay: 98.0, severity: "High", fill: "#dc2626" },
  { distance: 150, delay: 2.1, severity: "Low", fill: "#15803d" },
  { distance: 600, delay: 14.5, severity: "Low", fill: "#15803d" },
  { distance: 900, delay: 48.0, severity: "High", fill: "#dc2626" }
];

// Corridor Comparisons (Average Delays)
const CORRIDOR_COMPARISON = [
  { name: "Berlin - Paris", delay: 14.2, efficiency: 92 },
  { name: "Warsaw - Hamburg", delay: 8.7, efficiency: 96 },
  { name: "Rotterdam - Genoa", delay: 38.4, efficiency: 68 },
  { name: "Paris - Milan", delay: 11.5, efficiency: 89 },
  { name: "Vienna - Budapest", delay: 5.2, efficiency: 98 },
  { name: "Munich - Verona", delay: 49.1, efficiency: 48 }
];

// Aggregated Delay Variance by Year/Quarter
const YEARLY_AGGREGATES = [
  { quarter: "Q1-25", actual: 16.4, predicted: 15.9 },
  { quarter: "Q2-25", actual: 14.2, predicted: 14.5 },
  { quarter: "Q3-25", actual: 12.8, predicted: 12.5 },
  { quarter: "Q4-25", actual: 18.2, predicted: 17.8 },
  { quarter: "Q1-26", actual: 15.1, predicted: 14.9 },
  { quarter: "Q2-26", actual: 11.9, predicted: 11.8 }
];

export default function HistoricalAnalyticsPage() {
  const [selectedCorridor, setSelectedCorridor] = useState("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");

  // Filtering logic for the scatter plot
  const filteredScatter = SCATTER_DATA.filter(point => {
    if (selectedSeverity !== "ALL" && point.severity !== selectedSeverity) return false;
    return true;
  });

  const handleResetFilters = () => {
    setSelectedCorridor("ALL");
    setSelectedSeverity("ALL");
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-wide text-text-primary font-serif flex items-center gap-2">
            <ChartIcon className="text-brand-saffron" />
            <span>Advanced Analytics Dashboard</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-serif">
            Query long-term historical datasets to verify corridor congestion thresholds and delay correlations.
          </p>
        </div>
        
        <button 
          onClick={() => alert("Exporting current filter analytical subset to CSV...")}
          className="px-4 py-2 rounded bg-bg-card hover:bg-slate-100 dark:hover:bg-brand-blue-light/5 border border-border-primary text-brand-blue dark:text-brand-accent-blue text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
        >
          <Download size={14} />
          <span>EXPORT ANTE-DATA</span>
        </button>
      </div>

      {/* Sliders and Filters Control Deck */}
      <div className="p-4 rounded-xl border border-border-primary bg-bg-card shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-3 text-xs font-bold text-text-primary font-serif">
          <SlidersHorizontal size={14} className="text-brand-saffron" />
          <span>FILTER CONTROLS DECK</span>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          
          {/* Corridor Selection */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Corridor:</span>
            <select 
              value={selectedCorridor}
              onChange={(e) => setSelectedCorridor(e.target.value)}
              className="bg-bg-primary border border-border-primary rounded py-1 px-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-blue"
            >
              <option value="ALL">All Trans-European Networks</option>
              <option value="BER-PAR">Berlin - Paris Corridor</option>
              <option value="ROT-GEN">Rotterdam - Genoa Trunk Line</option>
              <option value="MUN-VER">Munich - Verona Alps Crossing</option>
            </select>
          </div>

          {/* Severity Selection */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Severity:</span>
            <select 
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-bg-primary border border-border-primary rounded py-1 px-2.5 text-xs text-text-primary focus:outline-none focus:border-brand-blue"
            >
              <option value="ALL">All Severities</option>
              <option value="Low">Low Delay (&lt;15m)</option>
              <option value="Medium">Medium Delay (15m - 45m)</option>
              <option value="High">High Delay (&gt;45m)</option>
            </select>
          </div>

          {/* Reset Filters button */}
          <button 
            onClick={handleResetFilters}
            className="p-1 rounded bg-bg-primary border border-border-primary text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Main Aggregations and Comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quarter Aggregations Line/Bar Combo */}
        <div className="lg:col-span-6 p-5 rounded-xl border border-border-primary bg-bg-card shadow-sm">
          <div className="border-b border-border-primary pb-2 mb-4">
            <h3 className="text-sm font-bold text-text-primary font-serif">Historical Quarterly Delays</h3>
            <p className="text-[10px] text-slate-500">Comparing quarterly actual average delays vs model estimations</p>
          </div>

          <div className="h-60 text-slate-500 dark:text-slate-400">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={YEARLY_AGGREGATES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" />
                <XAxis dataKey="quarter" stroke="var(--brand-silver)" style={{ fontSize: '10px' }} />
                <YAxis stroke="var(--brand-silver)" style={{ fontSize: '10px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--card-bg)", borderColor: "var(--brand-border)", color: "var(--foreground)" }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Bar dataKey="actual" fill="var(--brand-blue)" radius={[4, 4, 0, 0]} name="Actual Delay (mins)" />
                <Bar dataKey="predicted" fill="var(--brand-saffron)" radius={[4, 4, 0, 0]} name="Predicted Delay (mins)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Route Comparisons Bar Chart */}
        <div className="lg:col-span-6 p-5 rounded-xl border border-border-primary bg-bg-card shadow-sm">
          <div className="border-b border-border-primary pb-2 mb-4">
            <h3 className="text-sm font-bold text-text-primary font-serif">Corridor Delay Comparisons</h3>
            <p className="text-[10px] text-slate-500">Aggregated average transit arrival delays sorted by corridor hubs</p>
          </div>

          <div className="h-60 text-slate-500 dark:text-slate-400">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CORRIDOR_COMPARISON} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" />
                <XAxis dataKey="name" stroke="var(--brand-silver)" style={{ fontSize: '10px' }} />
                <YAxis stroke="var(--brand-silver)" style={{ fontSize: '10px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--card-bg)", borderColor: "var(--brand-border)", color: "var(--foreground)" }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Bar dataKey="delay" fill="var(--brand-blue)" radius={[4, 4, 0, 0]} name="Avg Delay (mins)">
                  {CORRIDOR_COMPARISON.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.delay > 30 ? "#dc2626" : entry.delay > 12 ? "#ea580c" : "#2563eb"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Advanced Scatter Plot: Distance vs Delay */}
      <div className="p-5 rounded-xl border border-border-primary bg-bg-card shadow-sm">
        <div className="border-b border-border-primary pb-2 mb-4 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-text-primary font-serif">Distance vs Delay Correlation</h3>
            <p className="text-[10px] text-slate-500">Scatter distribution analyzing how transit length affects expected arrival delay</p>
          </div>
          <div className="flex space-x-3 text-[9px] font-bold">
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-[#15803d]"></span><span className="text-slate-500 dark:text-slate-400">LOW</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-[#ea580c]"></span><span className="text-slate-500 dark:text-slate-400">MEDIUM</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-[#dc2626]"></span><span className="text-slate-500 dark:text-slate-400">HIGH</span></span>
          </div>
        </div>

        <div className="h-72 text-slate-500 dark:text-slate-400">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--brand-border)" />
              <XAxis type="number" dataKey="distance" name="Distance" unit=" km" stroke="var(--brand-silver)" style={{ fontSize: '10px' }} />
              <YAxis type="number" dataKey="delay" name="Delay" unit=" mins" stroke="var(--brand-silver)" style={{ fontSize: '10px' }} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: "var(--card-bg)", borderColor: "var(--brand-border)", color: "var(--foreground)" }}
                itemStyle={{ fontSize: "11px" }}
              />
              <Scatter name="Transit Runs" data={filteredScatter}>
                {filteredScatter.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
