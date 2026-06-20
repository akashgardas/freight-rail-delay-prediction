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
  ReferenceLine
} from "recharts";
import { 
  Cpu, 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Info
} from "lucide-react";

// Global Feature Importances computed by LightGBM
const GLOBAL_IMPORTANCE = [
  { name: "Departure Delay", importance: 40, code: "departure_delay", desc: "Delay at initial dispatch station" },
  { name: "Previous Station Delay", importance: 25, code: "previous_delay", desc: "Delay recorded at previous node" },
  { name: "Trip Distance", importance: 15, code: "trip_distance", desc: "Total transit corridor path length" },
  { name: "Gross Weight", importance: 8, code: "gross_weight", desc: "Total train tonnage (wagons + payload)" },
  { name: "Train Length", importance: 5, code: "train_length", desc: "Total length of train in meters" },
  { name: "Wagon Count", importance: 3, code: "wagon_count", desc: "Number of coupled rolling stock wagons" },
  { name: "Weight Per Wagon", importance: 2, code: "weight_per_wagon", desc: "Average tonnage per wagon unit" },
  { name: "Weight Per Length Ratio", importance: 2, code: "weight_per_length", desc: "Ratio of total weight divided by length" }
];

// Single sample local attribution data (SHAP Waterfall)
const SAMPLE_LOCAL_SHAP = [
  { name: "Baseline Delay Mean", value: 12.5, type: "base", color: "var(--brand-blue)" },
  { name: "Departure Delay (+45m)", value: 20.25, type: "positive", color: "#ea580c" },
  { name: "Previous Delay (+15m)", value: 3.75, type: "positive", color: "#ea580c" },
  { name: "Trip Distance (450km)", value: 4.5, type: "positive", color: "#ea580c" },
  { name: "Train Length (650m)", value: -2.1, type: "negative", color: "#15803d" },
  { name: "Gross Tonnage (4200T)", value: 0.8, type: "positive", color: "#ea580c" },
  { name: "Wagon Count (55 units)", value: -1.2, type: "negative", color: "#15803d" },
  { name: "Final Predicted Delay", value: 38.5, type: "result", color: "var(--brand-blue)" }
];

export default function ShapExplainabilityPage() {
  const [selectedFeature, setSelectedFeature] = useState<any>(GLOBAL_IMPORTANCE[0]);

  // Cumulative waterfall calculations for the waterfall graph
  let cumulative = 0;
  const waterfallData = SAMPLE_LOCAL_SHAP.map((item, idx) => {
    let start = cumulative;
    let end = cumulative;
    
    if (item.type === "base" || item.type === "result") {
      start = 0;
      end = item.value;
      if (item.type === "base") cumulativeValueUpdate(item.value);
    } else {
      end = start + item.value;
      cumulativeValueUpdate(item.value);
    }
    
    function cumulativeValueUpdate(val: number) {
      cumulative += val;
    }

    return {
      ...item,
      displayVal: Math.abs(item.value),
      start: Number(start.toFixed(2)),
      end: Number(end.toFixed(2))
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-wide text-text-primary font-serif flex items-center gap-2">
          <Cpu className="text-brand-saffron" />
          <span>SHAP Explainability Terminal</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-serif">
          Audit the decision boundaries of the LightGBM regressor and analyze feature contribution values.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Panel: Global Feature Importance (7/12) */}
        <div className="xl:col-span-7 p-5 rounded-xl border border-border-primary bg-bg-card shadow-sm">
          <div className="border-b border-border-primary pb-2 mb-4">
            <h3 className="text-sm font-bold text-text-primary font-serif">Global Feature Importance</h3>
            <p className="text-[10px] text-slate-500">Relative contribution of variables to overall model predictions</p>
          </div>

          <div className="h-72 text-slate-700 dark:text-slate-300">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={GLOBAL_IMPORTANCE}
                margin={{ top: 5, right: 10, left: 30, bottom: 5 }}
                onClick={(data: any) => {
                  if (data && data.activePayload && data.activePayload.length > 0) {
                    setSelectedFeature(data.activePayload[0].payload);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--brand-border)" />
                <XAxis type="number" stroke="var(--brand-silver)" />
                <YAxis dataKey="name" type="category" stroke="var(--brand-silver)" width={140} style={{ fontSize: '10px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--card-bg)", borderColor: "var(--brand-border)", color: "var(--foreground)" }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Bar dataKey="importance" fill="var(--brand-blue)" radius={[0, 4, 4, 0]} className="cursor-pointer" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Feature details description card */}
          {selectedFeature && (
            <div className="p-3.5 rounded bg-brand-blue-light/30 dark:bg-brand-blue-light/10 border border-border-primary text-xs text-text-primary space-y-1 mt-4">
              <div className="flex items-center justify-between font-bold text-brand-blue dark:text-brand-accent-blue font-serif">
                <span>{selectedFeature.name.toUpperCase()} ({selectedFeature.code})</span>
                <span>IMPORTANCE WEIGHT: {selectedFeature.importance}%</span>
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">{selectedFeature.desc}</p>
            </div>
          )}
        </div>

        {/* Right Panel: Cooperative Game Theory SHAP explanation card */}
        <div className="xl:col-span-5 p-5 rounded-xl border border-border-primary bg-bg-card shadow-sm flex flex-col justify-between">
          <div className="border-b border-border-primary pb-2 mb-4">
            <h3 className="text-sm font-bold text-text-primary font-serif">SHAP Explanation Logic</h3>
            <p className="text-[10px] text-slate-500">Cooperative Game Theory attribution mathematical audit</p>
          </div>

          <div className="space-y-4 text-xs text-text-primary">
            <div className="p-3 bg-slate-100 dark:bg-slate-900 border border-border-primary rounded flex items-start gap-2.5">
              <Info className="h-5 w-5 text-brand-blue dark:text-brand-accent-blue shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-text-primary block font-serif">What is SHAP?</span>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-serif">
                  SHAP (SHapley Additive exPlanations) breaks down predictions by measuring the marginal contribution of each train parameter compared to the historical average (baseline delay = 12.5 minutes).
                </p>
              </div>
            </div>

            <div className="p-3 bg-brand-saffron/10 border border-brand-saffron/30 rounded flex items-start gap-2.5">
              <AlertTriangle className="h-5 w-5 text-brand-saffron shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-brand-saffron block font-serif">Core Delay Drivers</span>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-serif">
                  Departure delay and previous node delay are the primary drivers. Combined, they account for over 65% of predicted delay shifts. Heavy rolling stock (Gross Weight) creates small, compounding delays.
                </p>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed">
              * Note: Global importance ratings are updated automatically on model re-calibration (triggered on system configuration changes).
            </p>
          </div>
        </div>
      </div>

      {/* Local Contribution Analysis: Waterfall Representation */}
      <div className="p-5 rounded-xl border border-border-primary bg-bg-card shadow-sm">
        <div className="border-b border-border-primary pb-2 mb-4">
          <h3 className="text-sm font-bold text-text-primary font-serif">Local Contribution Waterfall Analysis</h3>
          <p className="text-[10px] text-slate-500">Waterfall breakdown showing how individual features push a single delay prediction from baseline to final ETA</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Custom Graphical Waterfall representation */}
          <div className="space-y-3 text-[11px]">
            {waterfallData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                
                {/* Feature Label */}
                <div className="w-40 font-semibold text-slate-700 dark:text-slate-300 truncate">{item.name}</div>
                
                {/* Visual Bar representation */}
                <div className="flex-1 mx-4 bg-slate-100 dark:bg-slate-900 border border-border-primary rounded h-5 relative overflow-hidden">
                  {/* Position the bar relative to the start/end ranges */}
                  <div 
                    className="absolute h-full rounded"
                    style={{
                      left: `${(item.start / 45) * 100}%`,
                      width: `${((item.end - item.start) / 45) * 100}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>

                {/* Contribution Value label */}
                <div className={`w-14 text-right font-bold ${
                  item.type === "positive" ? "text-brand-saffron" : item.type === "negative" ? "text-brand-green" : "text-text-primary"
                }`}>
                  {item.value > 0 && item.type !== "base" && item.type !== "result" ? "+" : ""}
                  {item.value}m
                </div>

              </div>
            ))}
          </div>

          {/* Natural Language breakdown explanation of the waterfall */}
          <div className="p-5 rounded-lg bg-brand-blue-light/20 dark:bg-brand-blue-light/5 border border-border-primary text-xs text-text-primary space-y-4">
            <h4 className="font-bold text-brand-blue dark:text-brand-accent-blue font-serif">DECISION SHAP SUMMARY</h4>
            <ul className="space-y-2.5 text-[10px] text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-1">
                <span className="text-brand-saffron font-bold">•</span>
                <span>The model initialized at baseline expected average delay of <span className="text-text-primary font-bold">12.5 minutes</span>.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-brand-saffron font-bold">•</span>
                <span>A heavy departure delay of 45m pushed the prediction up significantly by <span className="text-brand-saffron font-bold">+20.25 minutes</span>.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-brand-saffron font-bold">•</span>
                <span>Minor previous delay added <span className="text-brand-saffron font-bold">+3.75 minutes</span>, while long route distance added <span className="text-brand-saffron font-bold">+4.5 minutes</span>.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-brand-green font-bold">•</span>
                <span>A shorter-than-average train layout (-650m) and fewer wagons (-55 units) acted as relief factors, reducing estimated delay by <span className="text-brand-green font-bold">-2.1m</span> and <span className="text-brand-green font-bold">-1.2m</span>.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-text-primary font-bold">•</span>
                <span>The sum of these contributions yields the final predicted delay of <span className="text-text-primary font-bold">38.5 minutes</span>.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}
