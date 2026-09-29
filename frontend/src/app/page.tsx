"use client";

import { useState, useEffect } from "react";
import { Activity, Clock, ShieldCheck, Target, TrendingDown, Zap, Globe, Cpu, Database, Server, RefreshCw, Plus, ArrowRight, Play, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

function MetricCard({ title, value, trend, icon: Icon, color, isDemo }: any) {
  return (
    <div className="bg-surface border border-surface-border p-5 rounded-lg flex flex-col relative overflow-hidden group">
      <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-radial opacity-10 rounded-full blur-2xl -mr-10 -mt-10", color)} />
      {isDemo && (
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-mono bg-warning/20 text-warning border border-warning/30">DEMO</div>
      )}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-xs font-mono tracking-wider text-foreground/50 uppercase">{title}</span>
        <Icon className={cn("w-4 h-4", color.replace('bg-', 'text-'))} />
      </div>
      <div className="flex items-end gap-3 relative z-10">
        <span className="text-3xl font-light tracking-tight">{value}</span>
        {trend && (
          <span className="text-xs font-mono text-success flex items-center mb-1">
            <TrendingDown className="w-3 h-3 mr-1" />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

export default function CommandCenter() {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [detections, setDetections] = useState<any[]>([]);
  const [sysHealth, setSysHealth] = useState<any>(null);

  // Fetch actual data when Live Mode is enabled
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const fetchLiveData = async () => {
      try {
        const [articlesRes, sysRes] = await Promise.all([
          fetch('http://localhost:8000/api/articles?limit=10').catch(() => null),
          fetch('http://localhost:8000/api/system/health').catch(() => null)
        ]);

        if (articlesRes && articlesRes.ok) {
          const data = await articlesRes.json();
          // Transform for UI
          const transformed = data.map((a: any) => ({
            id: a.id,
            title: a.title,
            source: a.competitor_id, // In a real app, join competitor name
            latency: a.detection_latency_seconds || 0,
            method: a.source_method,
            time: new Date(a.detected_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            targetMet: a.target_met
          }));
          setDetections(transformed);
        }

        if (sysRes && sysRes.ok) {
          const sysData = await sysRes.json();
          setSysHealth(sysData);
        }
      } catch (err) {
        console.error("Failed to fetch live data:", err);
      }
    };

    if (isLiveMode) {
      fetchLiveData();
      interval = setInterval(fetchLiveData, 15000);
    } else {
      // Demo Mode Fake Data
      setDetections([
        { id: 1, title: "AI Agents Are Changing E-Commerce", source: "TECHCRUNCH", latency: 41, method: "RSS", time: "10:42", targetMet: true },
        { id: 2, title: "Next.js 15 Release Candidate", source: "VERCEL BLOG", latency: 122, method: "SITEMAP", time: "09:15", targetMet: true },
        { id: 3, title: "The Future of Cloud Native Infrastructure", source: "AWS COMPUTE", latency: 312, method: "DIRECT", time: "08:30", targetMet: false },
      ]);
      
      setSysHealth({
        components: {
          database: "HEALTHY",
          redis: "HEALTHY",
          scheduler: "HEALTHY",
          workers: "HEALTHY",
          rss_monitor: "DEGRADED",
          sitemap_monitor: "HEALTHY"
        },
        metrics: {
          active_competitors: 94,
          articles_today: 127,
          avg_latency: "02:41",
          fastest: "00:19"
        }
      });

      interval = setInterval(() => {
        setDetections(prev => {
          const newDet = {
            id: Date.now(),
            title: "New Automated Intelligence Report",
            source: "ACME AI",
            latency: Math.floor(Math.random() * 300) + 10,
            method: ["RSS", "SITEMAP", "DIRECT"][Math.floor(Math.random() * 3)],
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            targetMet: Math.random() > 0.3
          };
          return [newDet, ...prev.slice(0, 4)];
        });
      }, 15000);
    }

    return () => clearInterval(interval);
  }, [isLiveMode]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-wider">COMMAND CENTER</h1>
          <p className="text-sm text-foreground/50 font-mono mt-1">Real-time visibility into competitor publishing activity.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-surface border border-surface-border p-1 rounded-md">
            <button 
              onClick={() => setIsLiveMode(false)}
              className={cn("px-3 py-1 text-xs font-mono rounded transition-colors", !isLiveMode ? "bg-primary/20 text-primary" : "text-foreground/50 hover:text-foreground")}
            >
              DEMO DATA
            </button>
            <button 
              onClick={() => setIsLiveMode(true)}
              className={cn("px-3 py-1 text-xs font-mono rounded transition-colors flex items-center gap-2", isLiveMode ? "bg-danger/20 text-danger border border-danger/30 shadow-[0_0_10px_rgba(255,50,50,0.2)]" : "text-foreground/50 hover:text-foreground")}
            >
              <div className={cn("w-1.5 h-1.5 rounded-full", isLiveMode ? "bg-danger animate-pulse" : "bg-foreground/30")} />
              LIVE
            </button>
          </div>
        </div>
      </div>

      {!isLiveMode && (
        <div className="bg-warning/10 border border-warning/20 text-warning px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-mono">Currently displaying simulated Demo Data. Switch to LIVE mode to view actual database metrics.</span>
        </div>
      )}

      {/* SECTION A & B: HERO AND METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-surface border border-surface-border rounded-lg p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
          
          <div className="relative z-10 w-full">
            <div className="w-40 h-40 mx-auto rounded-full border border-primary/20 flex items-center justify-center relative mb-6">
              {/* Outer pulsing ring */}
              <div className="absolute inset-[-10px] rounded-full border border-primary/10 animate-ping" style={{ animationDuration: '4s' }} />
              {/* Spinning rings */}
              <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-2 rounded-full border-b-2 border-secondary animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
              <div className="absolute inset-4 rounded-full border-r border-success/50 animate-spin" style={{ animationDuration: '5s' }} />
              
              <div className="text-center bg-background/80 rounded-full w-28 h-28 flex flex-col items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(0,200,255,0.15)]">
                <span className="block text-3xl font-light text-primary">{isLiveMode ? sysHealth?.metrics?.active_competitors || 0 : 94}</span>
                <span className="text-[9px] font-mono tracking-widest text-primary/70 mt-1">ACTIVE SOURCES</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between px-4 text-xs font-mono text-foreground/50">
              <span className="flex items-center gap-1.5"><div className={cn("w-1.5 h-1.5 rounded-full", isLiveMode ? (sysHealth ? "bg-success animate-pulse" : "bg-danger") : "bg-success animate-pulse")}/> SYSTEM {sysHealth ? "OPERATIONAL" : "OFFLINE"}</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-surface-border/50 grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
              <div>
                <span className="text-foreground/40 block mb-1">LAST CYCLE</span>
                <span className="text-foreground/80">{isLiveMode ? '3s ago' : '18s ago'}</span>
              </div>
              <div>
                <span className="text-foreground/40 block mb-1">NEXT CYCLE</span>
                <span className="text-primary">{isLiveMode ? '27s' : '42s'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
          <MetricCard title="Articles Discovered" value={isLiveMode ? sysHealth?.metrics?.articles_today || 0 : 127} isDemo={!isLiveMode} icon={Activity} color="bg-secondary" />
          <MetricCard title="Target Rate (< 5m)" value={isLiveMode ? "0%" : "87.4%"} isDemo={!isLiveMode} icon={Target} color="bg-success" />
          <MetricCard title="Avg Detection" value={isLiveMode ? sysHealth?.metrics?.avg_latency || "--" : "02:41"} trend={isLiveMode ? undefined : "18% vs 24h"} isDemo={!isLiveMode} icon={Clock} color="bg-primary" />
          <MetricCard title="Fastest Detection" value={isLiveMode ? sysHealth?.metrics?.fastest || "--" : "00:19"} isDemo={!isLiveMode} icon={Zap} color="bg-success" />
          <MetricCard title="Slowest Detection" value={isLiveMode ? "--" : "12:04"} isDemo={!isLiveMode} icon={Clock} color="bg-warning" />
          <MetricCard title="Failed Checks" value={isLiveMode ? "0" : "3"} isDemo={!isLiveMode} icon={ShieldCheck} color="bg-danger" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SECTION C: LIVE DETECTION FEED */}
        <div className="md:col-span-2 bg-surface border border-surface-border rounded-lg flex flex-col overflow-hidden h-[500px]">
          <div className="p-4 border-b border-surface-border flex justify-between items-center bg-surface-border/10">
            <h3 className="text-sm font-mono tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 bg-danger rounded-full animate-pulse shadow-[0_0_8px_var(--color-danger)]" />
              LIVE ACTIVITY FEED
            </h3>
            <button className="text-xs font-mono text-primary hover:text-primary-light transition-colors flex items-center gap-1">
              VIEW ALL <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            <AnimatePresence>
              {detections.length === 0 ? (
                <div className="text-center font-mono text-xs text-foreground/40 mt-10">NO DETECTIONS YET</div>
              ) : (
                detections.map((item) => (
                  <motion.div 
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item.id} 
                    className="group flex gap-4 p-4 rounded-md border border-surface-border/50 bg-background/50 hover:border-primary/30 transition-colors relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 flex flex-col items-center justify-center border-r border-surface-border/50 pr-4">
                      <span className="text-xs font-mono text-foreground/50 mb-1">{item.time}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-mono text-primary tracking-wider font-bold truncate max-w-[200px]">{item.source}</span>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-mono whitespace-nowrap", item.targetMet ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20")}>
                          {item.targetMet ? "✓ TARGET MET" : "! TARGET EXCEEDED"}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium mb-3 group-hover:text-primary transition-colors">{item.title}</h4>
                      <div className="flex items-center gap-4 text-[10px] font-mono">
                        <span className="px-2 py-1 bg-surface-border/30 rounded text-foreground/70">METHOD: <span className="text-secondary">{item.method}</span></span>
                        <span className="px-2 py-1 bg-surface-border/30 rounded text-foreground/70">LATENCY: <span className={item.targetMet ? "text-success" : "text-warning"}>{Math.floor(item.latency/60).toString().padStart(2, '0')}:{(item.latency%60).toString().padStart(2, '0')}</span></span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SECTION D & E: PERFORMANCE & ACTIVITY */}
        <div className="space-y-6 flex flex-col h-[500px]">
          <div className="flex-1 bg-surface border border-surface-border rounded-lg p-4 flex flex-col">
            <h3 className="text-xs font-mono tracking-widest text-foreground/50 mb-4">DETECTION LATENCY</h3>
            <div className="flex-1 flex items-end gap-2 relative">
              {/* Target Line */}
              <div className="absolute left-0 right-0 bottom-[60%] border-t border-dashed border-success/50 z-0">
                <span className="absolute -top-4 right-0 text-[9px] font-mono text-success">TARGET 05:00</span>
              </div>
              
              {/* Mock Chart bars */}
              {(isLiveMode && detections.length === 0 ? [] : [30, 45, 20, 80, 60, 25, 40, 95, 30, 110, 45, 15]).map((h, i) => (
                <div key={i} className={cn("flex-1 hover:bg-primary/50 transition-colors rounded-t-sm relative group z-10", h > 60 ? "bg-warning/40" : "bg-primary/20")} style={{ height: `${h}%` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono bg-surface border border-surface-border px-1 rounded z-20">
                    {Math.floor((h/20)*60)}s
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-surface-border flex justify-between text-[10px] font-mono text-foreground/40">
              <span>08:00</span>
              <span>12:00</span>
            </div>
          </div>

          <div className="h-[200px] bg-surface border border-surface-border rounded-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-mono tracking-widest text-foreground/50">SYSTEM HEALTH</h3>
              <button className="text-[10px] font-mono text-primary hover:underline">DETAILS</button>
            </div>
            <div className="space-y-3 flex-1 overflow-auto pr-2">
              <HealthRow label="HTTP WORKERS" status={sysHealth?.components?.workers || "UNKNOWN"} icon={Cpu} />
              <HealthRow label="DATABASE" status={sysHealth?.components?.database || "UNKNOWN"} icon={Database} />
              <HealthRow label="REDIS / QUEUE" status={sysHealth?.components?.redis || "UNKNOWN"} icon={Server} />
              <HealthRow label="SCHEDULER" status={sysHealth?.components?.scheduler || "UNKNOWN"} icon={Clock} />
              <HealthRow label="RSS MONITOR" status={sysHealth?.components?.rss_monitor || "UNKNOWN"} icon={Activity} />
              <HealthRow label="SITEMAP MONITOR" status={sysHealth?.components?.sitemap_monitor || "UNKNOWN"} icon={Globe} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthRow({ label, status, icon: Icon }: { label: string, status: string, icon: any }) {
  return (
    <div className="flex justify-between items-center text-[10px] font-mono group cursor-pointer hover:bg-background/50 p-1.5 rounded -mx-1.5 transition-colors">
      <span className="text-foreground/70 flex items-center gap-2">
        <Icon className="w-3 h-3 text-foreground/40 group-hover:text-primary transition-colors" />
        {label}
      </span>
      <span className={cn("flex items-center", status === 'HEALTHY' ? "text-success" : status === 'DEGRADED' ? "text-warning" : status === 'UNKNOWN' ? "text-foreground/50" : "text-danger")}>
        <span className={cn("w-1.5 h-1.5 rounded-full mr-2", status === 'HEALTHY' ? "bg-success" : status === 'DEGRADED' ? "bg-warning" : status === 'UNKNOWN' ? "bg-foreground/50" : "bg-danger")} />
        {status}
      </span>
    </div>
  );
}
