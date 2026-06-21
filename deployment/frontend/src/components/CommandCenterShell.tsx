"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  LayoutDashboard, 
  Map, 
  Clock, 
  Cpu, 
  LineChart, 
  FileText, 
  Menu, 
  X, 
  Bell, 
  Settings, 
  Search, 
  Download, 
  User, 
  ShieldCheck,
  Server,
  Sun,
  Moon
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const MENU_ITEMS: MenuItem[] = [
  { name: "Home Portal", href: "/", icon: Home },
  { name: "Executive Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Live Control Room", href: "/control-room", icon: Map },
  { name: "Delay Prediction", href: "/predict", icon: Clock },
  { name: "SHAP Explainability", href: "/explainability", icon: Cpu },
  { name: "Historical Analytics", href: "/analytics", icon: LineChart },
  { name: "Reports & Logs", href: "/reports", icon: FileText }
];

export default function CommandCenterShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [notifications, setNotifications] = useState<string[]>([
    "Fog disruption warning in Northern corridor",
    "Rotterdam cargo train delay prediction recalculating",
    "Model v4.2 calibration complete (RMSE 4.25)"
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  // Update clock in real-time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false
      };
      setCurrentTime(now.toLocaleString('en-US', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleExportLogs = () => {
    alert("Exporting security and prediction audit logs in CSV format. Download initiating...");
    const csvContent = "data:text/csv;charset=utf-8,Timestamp,Event,Details\n" + 
      new Date().toISOString() + ",Audit Log,Admin official exported system logs\n" +
      new Date().toISOString() + ",Prediction,Berlin-Paris Route delay verified\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CargoETA_SystemLogs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      
      {/* Dynamic line accent at the absolute top */}
      <div className="h-[4px] w-full bg-gradient-to-r from-brand-blue via-brand-accent-blue to-brand-blue shrink-0" />
      
      {/* European Railway Agency Header Banner */}
      <header className="sticky top-0 z-40 w-full bg-bg-header text-white px-4 py-2.5 flex items-center justify-between shadow-md border-b border-white/10">
        
        {/* Left Side: Brand and Agency Badges */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg border border-white/20 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            title="Toggle Sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-base tracking-wide text-white font-extrabold flex items-center gap-1.5">
                <span className="text-[#f97316]">Cargo</span>
                <span className="text-blue-300">ETA</span>
              </span>
              <span className="h-4 w-[1px] bg-white/30"></span>
              <span className="text-[10px] uppercase font-bold text-blue-300 tracking-widest">
                FROIS Portal
              </span>
            </div>
            <span className="text-[9px] text-slate-300 tracking-tight">
              European Railway Agency & EU Joint Logistics Division
            </span>
          </div>
        </div>

        {/* Center: Search corridors */}
        <div className="hidden md:flex items-center max-w-sm w-full mx-8 relative">
          <Search size={14} className="absolute left-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search rail corridors, wagons, or stations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/20 rounded-lg py-1.5 pl-9 pr-4 text-xs placeholder:text-slate-400 text-white focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 transition-all"
          />
        </div>

        {/* Right Side: Telemetry controls, Notification Bell, User */}
        <div className="flex items-center space-x-4">
          
          {/* Live digital Clock */}
          <div className="hidden lg:flex flex-col items-end border-r border-white/10 pr-4">
            <span className="text-xs text-white tracking-wider font-semibold">
              {currentTime || "00:00:00"}
            </span>
            <span className="text-[8px] font-bold text-slate-300 tracking-widest uppercase">
              COORDINATED UNIVERSAL TIME
            </span>
          </div>

          {/* Network Connection Indicator */}
          <div className="flex items-center space-x-1 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-300 text-[9px] font-bold">
            <Server size={10} className="text-emerald-400" />
            <span>NODE ACTIVE</span>
          </div>

          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-white/20 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 rounded-lg border border-white/20 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors relative"
            >
              <Bell size={16} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#f97316] rounded-full animate-ping"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-bg-card border border-border-primary rounded-lg shadow-xl py-2 z-50">
                <div className="px-3 py-1.5 text-xs font-bold text-text-primary border-b border-border-primary flex justify-between">
                  <span>SYSTEM MESSAGES</span>
                  <span className="text-[9px] text-brand-saffron font-normal cursor-pointer" onClick={() => setNotifications([])}>CLEAR ALL</span>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-border-primary/45">
                  {notifications.length === 0 ? (
                    <div className="px-3 py-4 text-center text-[10px] text-slate-500">No new operations alerts.</div>
                  ) : (
                    notifications.map((note, index) => (
                      <div key={index} className="px-3 py-2 text-[10px] text-text-primary/80 hover:bg-brand-blue-light/10">
                        • {note}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* System Settings Cog */}
          <button 
            className="p-1.5 rounded-lg border border-white/20 text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            title="System Settings"
            onClick={() => alert("Model Calibration & API variables setting panel available under security authentication.")}
          >
            <Settings size={16} />
          </button>

          {/* Admin official profile */}
          <div className="flex items-center space-x-2 border-l border-white/10 pl-3">
            <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-slate-200">
              <User size={14} />
            </div>
            <div className="hidden xl:flex flex-col">
              <span className="text-[10px] font-bold text-white leading-tight">Admin Official</span>
              <span className="text-[8px] text-slate-300">Divisional Head</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Collapsible Command Center Sidebar */}
        <aside className={`${
          sidebarOpen ? "w-64" : "w-0 -translate-x-full md:w-16 md:translate-x-0"
        } transition-all duration-300 ease-in-out bg-bg-sidebar border-r border-border-primary flex flex-col justify-between overflow-y-auto shrink-0 z-30`}>
          
          <div className="py-4">
            
            {/* Sidebar Branding block */}
            {sidebarOpen ? (
              <div className="px-4 mb-5 pb-4 border-b border-border-primary">
                <div className="flex items-center space-x-2 text-xs font-bold text-text-primary">
                  <ShieldCheck size={14} className="text-brand-saffron" />
                  <span>SECURE TERMINAL</span>
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">
                  USER ROLE: SECURE_OPERATOR_I
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-5">
                <ShieldCheck size={16} className="text-brand-saffron" />
              </div>
            )}

            {/* Navigation links */}
            <nav className="space-y-1.5 px-2">
              {MENU_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative flex items-center space-x-3 px-3 py-2 rounded-xl text-xs transition-all duration-300 ${
                      isActive
                        ? "bg-brand-blue-light text-brand-blue dark:bg-brand-blue-light/10 dark:text-[#f97316] border-l-2 border-[#ea580c] font-bold" 
                        : "text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-gradient-to-r hover:from-[#f97316]/20 hover:via-[#fb923c]/10 hover:to-transparent hover:border hover:border-[#f97316]/30 hover:shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:translate-x-1"
                    }`}
                  >
                  <Icon
                    size={16}
                    className={`transition-all duration-300 ${
                      isActive
                        ? "text-[#f97316]"
                        : "text-brand-accent-blue group-hover:text-[#fb923c] group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                    }`}
                  />

                    {sidebarOpen && <span className="tracking-wide">{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer block: Logs Export and Profile status */}
          <div className="p-3 border-t border-border-primary space-y-3">
            {sidebarOpen ? (
              <>
                <button
                  onClick={handleExportLogs}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-1.5 rounded border border-border-primary bg-bg-card hover:bg-slate-100 dark:hover:bg-brand-blue-light/5 text-brand-blue dark:text-brand-accent-blue text-[10px] transition-all uppercase font-semibold"
                >
                  <Download size={12} />
                  <span>Export System Logs</span>
                </button>
                
                <div className="p-2 rounded bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div className="text-[9px] text-emerald-700 dark:text-emerald-400 font-bold leading-none">
                    GRID INTEL SYNCED
                  </div>
                </div>
              </>
            ) : (
              <button 
                onClick={handleExportLogs}
                className="w-full flex items-center justify-center p-1.5 rounded border border-border-primary bg-bg-card hover:bg-slate-100 dark:hover:bg-brand-blue-light/5 text-brand-blue dark:text-brand-accent-blue transition-all"
                title="Export Logs"
              >
                <Download size={14} />
              </button>
            )}
          </div>
        </aside>

        {/* Content Page viewport */}
        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </div>
          
          {/* Official ERA and EU Joint Logistics Division style footer */}
          <footer className="w-full bg-bg-sidebar border-t border-border-primary py-4 px-6 md:px-8 text-[10px] text-slate-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col items-center md:items-start">
                <span className="font-bold text-slate-700 dark:text-slate-400 uppercase text-[11px] tracking-wide">
                  CARGOETA AI LOGISTICS ENGINE
                </span>
                <span className="text-[9px] mt-0.5 text-center md:text-left text-slate-500">
                  © 2026 European Railway Agency (ERA) & EU Joint Logistics Division. All Rights Reserved.
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-slate-600 dark:text-slate-400">
                <a href="#portal" className="hover:text-brand-blue transition-colors">ERA Logistics Portal</a>
                <span className="text-slate-300 dark:text-slate-800">|</span>
                <a href="#contact" className="hover:text-brand-blue transition-colors">Contact Admin</a>
                <span className="text-slate-300 dark:text-slate-800">|</span>
                <a href="#safety" className="hover:text-brand-blue transition-colors">Safety Portal</a>
              </div>
            </div>
          </footer>
        </main>

      </div>
    </div>
  );
}
