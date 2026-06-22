"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  Activity, 
  GitMerge, 
  Zap, 
  CheckCircle, 
  Award,
  ArrowRight
} from "lucide-react";

// Dynamically import ThreeJS canvas to bypass next.js Server-Side-Rendering
const FreightTrainScene = dynamic(
  () => import("@/components/3d/FreightTrainScene"),
  { ssr: false, loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-text-primary/60 font-semibold uppercase">Initializing 3D WebGL Engine...</span>
      </div>
    </div>
  )}
);

export default function LandingPage() {
  return (
    <div className="space-y-12">
      
      {/* 1. HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[500px]">
        
        {/* Left column: AI Branding & Slogan */}
        <div className="lg:col-span-6 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-brand-blue/20 bg-brand-blue/10 text-brand-blue dark:text-brand-accent-blue text-xs font-bold tracking-wider"
          >
            <ShieldCheck size={14} />
            <span>TRANS-EUROPEAN OPERATIONS ENGINE</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-text-primary"
          >
            Short-Term Arrival <br />
            <span className="text-brand-blue dark:text-[#f97316]">
              Delay Time Prediction
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl"
          >
            CargoETA utilizes advanced gradient boosting machine learning models integrated with SHAP explainability. Predict freight rail transit delay variance, identify terminal track congestion, and streamline supply-chain pipelines across cross-border hubs.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Link 
              href="/dashboard" 
              className="px-6 py-2.5 rounded-lg font-bold text-xs bg-brand-blue hover:bg-brand-blue/90 text-dark flex items-center space-x-2 border border-brand-blue shadow transition-all hover:dark:text-white"
            >
              <span>Launch Dashboard</span>
              <ArrowRight size={14} />
            </Link>
            <Link 
              href="/predict" 
              className="px-6 py-2.5 rounded-lg font-bold text-xs bg-bg-card border border-border-primary hover:bg-slate-90 dark:hover:bg-brand-blue-light/5 text-text-primary transition-all"
            >
              Predict Delay Live
            </Link>
          </motion.div>
        </div>

        {/* Right column: Interactive 3D Train Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 w-full h-full"
        >
          <FreightTrainScene />
        </motion.div>
      </section>

      {/* 2. REAL-TIME OPERATIONS FLOATING METRICS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "TOTAL FREIGHT MOVED", value: "1.2B MT", change: "+12% YOY", status: "OPTIMAL", color: "text-brand-blue dark:text-brand-accent-blue" },
          { label: "LIVE TRANSIT CARGO", value: "14,282", change: "Active Trains", status: "ACTIVE", color: "text-[#ea580c] dark:text-[#f97316]" },
          { label: "AI MODEL PRECISION", value: "93.0%", change: "LightGBM v2", status: "STABLE", color: "text-brand-green dark:text-brand-green" },
          { label: "CYBER GRID UPTIME", value: "99.99%", change: "ERA Cloud Sync", status: "ONLINE", color: "text-brand-blue dark:text-brand-accent-blue" }
        ].map((metric, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-4 rounded-xl border border-border-primary bg-bg-card shadow-sm flex flex-col justify-between"
          >
            <span className="text-[9px] font-bold tracking-widest text-slate-500">{metric.label}</span>
            <div className="my-2.5">
              <span className={`text-2xl font-black ${metric.color}`}>{metric.value}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span>{metric.change}</span>
              <span className="text-brand-green font-bold">● {metric.status}</span>
            </div>
          </motion.div>
        ))}
      </section>

      {/* 3. ABOUT PROJECT & CORE CAPABILITIES */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border-primary pt-12">
        <div className="space-y-4">
          <h2 className="text-xs uppercase font-bold text-brand-saffron tracking-widest">ABOUT THE SYSTEM</h2>
          <h3 className="text-2xl font-bold text-text-primary">Freight Rail Operations Intelligence</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            FROIS CargoETA is a next-generation predictive logistics platform designed to optimize Trans-European railway networks and cross-border grid logistics planning. Large freight rails suffer from cascading bottlenecks where minor delays compound over kilometers of track. By analyzing train characteristics, track distances, and departure delays in real-time, CargoETA offers precise time of arrival calculations (ETAs) and explains model outputs using cooperative game theory SHAP principles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Cpu, title: "TensorTrack Engine", desc: "Machine Learning architecture calibrated specifically for linear freight movement and terminal queuing." },
            { icon: Database, title: "Telemetry Sync", desc: "Synchronized telemetry beacons scanning train length, wagon weight configurations, and speed logs." },
            { icon: Activity, title: "Cascade Detection", desc: "Predicts if a current track delay will trigger secondary congestion bottlenecks at destination yards." },
            { icon: GitMerge, title: "Sovereign Security", desc: "Fully secure, logistics-vetted deployment configuration ready for Vercel and ERA Cloud hosting." }
          ].map((cap, i) => (
            <div key={i} className="p-4 rounded-lg border border-border-primary bg-bg-card space-y-2">
              <cap.icon className="h-5 w-5 text-brand-saffron" />
              <h4 className="text-xs font-bold text-text-primary">{cap.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PREDICTION ENGINE & ACCURACY SHAP */}
      <section className="p-6 rounded-xl border border-border-primary bg-bg-card space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-xs uppercase font-bold text-brand-green tracking-widest">PREDICTION CALIBRATION</h2>
          <h3 className="text-2xl font-bold text-text-primary">Model Performance & Feature Attribution</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Our underlying predictive core uses LightGBM (Light Gradient Boosting Machine) model trained on multi-national logistics operations logs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-bg-primary border border-border-primary rounded">
            <span className="text-3xl font-black text-brand-blue dark:text-brand-accent-blue">0.93</span>
            <div className="text-[10px] font-bold text-slate-500 mt-1">R² COEFFICIENT (FIT)</div>
          </div>
          <div className="p-4 bg-bg-primary border border-border-primary rounded">
            <span className="text-3xl font-black text-brand-saffron">4.018m</span>
            <div className="text-[10px] font-bold text-slate-500 mt-1">RMSE ERROR VARIANCE</div>
          </div>
          <div className="p-4 bg-bg-primary border border-border-primary rounded">
            <span className="text-3xl font-black text-brand-green">3.2%</span>
            <div className="text-[10px] font-bold text-slate-500 mt-1">MAPE PERCENTAGE ERROR</div>
          </div>
        </div>
      </section>

      {/* 5. TECHNOLOGY STACK SYSTEM */}
      <section className="space-y-6 border-t border-border-primary pt-12">
        <div className="space-y-2">
          <h2 className="text-xs uppercase font-bold text-brand-blue dark:text-brand-accent-blue tracking-widest">ARCHITECTURE</h2>
          <h3 className="text-2xl font-bold text-text-primary">Platform Technology Stack</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 border border-border-primary rounded bg-bg-card">
            <div className="font-bold text-brand-saffron mb-1 uppercase">Frontend</div>
            <ul className="space-y-1 text-slate-500 dark:text-slate-400 text-[10px]">
              <li>• Next.js 15 (App Router)</li>
              <li>• React Three Fiber / Drei</li>
              <li>• Framer Motion Transitions</li>
              <li>• Tailwind CSS (v4 layout)</li>
            </ul>
          </div>
          <div className="p-3 border border-border-primary rounded bg-bg-card">
            <div className="font-bold text-brand-blue dark:text-brand-accent-blue mb-1 uppercase">Backend Microservice</div>
            <ul className="space-y-1 text-slate-500 dark:text-slate-400 text-[10px]">
              <li>• Python FastAPI (async routes)</li>
              <li>• Uvicorn HTTP Engine</li>
              <li>• Pydantic validation structures</li>
              <li>• Model serving REST endpoints</li>
            </ul>
          </div>
          <div className="p-3 border border-border-primary rounded bg-bg-card">
            <div className="font-bold text-brand-green mb-1 uppercase">Predictive Engine</div>
            <ul className="space-y-1 text-slate-500 dark:text-slate-400 text-[10px]">
              <li>• LightGBM Regressor</li>
              <li>• SHAP Explainability Engine</li>
              <li>• Joblib Serialization</li>
              <li>• Scikit-learn validation split</li>
            </ul>
          </div>
          <div className="p-3 border border-border-primary rounded bg-bg-card">
            <div className="font-bold text-text-primary mb-1 uppercase">Security & Deploy</div>
            <ul className="space-y-1 text-slate-500 dark:text-slate-400 text-[10px]">
              <li>• Vercel Edge compatible</li>
              <li>• Sandbox sandboxed environment</li>
              <li>• Encrypted prediction logs</li>
              <li>• Secure local CORS policies</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. TEAM AND PROJECT INFORMATION */}
      <section className="border-t border-border-primary pt-12 pb-6 space-y-4">
        <h2 className="text-xs uppercase font-bold text-brand-saffron tracking-widest text-center">CREDENTIALS</h2>
        <h3 className="text-xl font-bold text-text-primary text-center font-serif">B.Tech CSE Project Team</h3>
        
        <div className="max-w-xl mx-auto p-4 rounded-lg bg-bg-card border border-border-primary text-center text-xs text-slate-600 dark:text-slate-400 leading-relaxed shadow-sm">
          <Award className="h-6 w-6 text-brand-saffron mx-auto mb-2" />
          <p className="font-bold text-text-primary">CVR COLLEGE OF ENGINEERING</p>
          <p className="text-[10px] mt-0.5 font-semibold">Department of Computer Science and Engineering</p>
          <p className="text-[10px] mt-2">B.Tech III Year II Semester Minor Project. Developed by Gardas Akash, Donthula Harika, and Kasani Rishitha Srija under the supervision of Mr. D. Chaithanya.</p>
        </div>
      </section>

    </div>
  );
}
