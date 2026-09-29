"use client";

import { useState, useEffect } from "react";
import { Activity, Play, Settings2, ShieldAlert, Cpu, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type SiteStatus = 'QUEUED' | 'RUNNING' | 'SUCCESS' | 'RETRYING' | 'FAILED' | 'DEGRADED';

interface SiteTask {
  id: number;
  status: SiteStatus;
  duration: number;
  workerId?: number;
}

export default function ScaleLabPage() {
  const [totalSites, setTotalSites] = useState(100);
  const [concurrency, setConcurrency] = useState(10);
  const [slowSite, setSlowSite] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [sites, setSites] = useState<SiteTask[]>([]);
  const [stats, setStats] = useState({ completed: 0, failed: 0, avgTime: 0, queueWait: 0 });

  const startTest = () => {
    setIsRunning(true);
    setStats({ completed: 0, failed: 0, avgTime: 0, queueWait: 0 });
    
    // Initialize sites
    const initialSites: SiteTask[] = Array.from({ length: totalSites }).map((_, i) => ({
      id: i + 1,
      status: 'QUEUED',
      duration: 0
    }));
    setSites(initialSites);
  };

  useEffect(() => {
    if (!isRunning) return;

    let activeWorkers = 0;
    const interval = setInterval(() => {
      setSites(prev => {
        const next = [...prev];
        let runningCount = next.filter(s => s.status === 'RUNNING' || s.status === 'RETRYING').length;
        let newlyCompleted = 0;
        let newlyFailed = 0;
        let sumTime = 0;

        for (let i = 0; i < next.length; i++) {
          if (next[i].status === 'RUNNING' || next[i].status === 'RETRYING') {
            next[i].duration += 500;
            
            // Randomly complete tasks
            let completeThreshold = 1500;
            if (slowSite && i === 17) completeThreshold = 8000;
            
            if (next[i].duration > completeThreshold) {
              if (simulateFailure && (i % 7 === 0)) {
                if (next[i].status === 'RUNNING') {
                  next[i].status = 'RETRYING';
                  next[i].duration = 0;
                } else {
                  next[i].status = 'DEGRADED';
                  newlyFailed++;
                }
              } else {
                next[i].status = 'SUCCESS';
                newlyCompleted++;
              }
              runningCount--;
            }
          }
        }

        // Start new tasks if we have capacity
        for (let i = 0; i < next.length && runningCount < concurrency; i++) {
          if (next[i].status === 'QUEUED') {
            next[i].status = 'RUNNING';
            next[i].workerId = Math.floor(Math.random() * concurrency) + 1;
            runningCount++;
          }
        }

        setStats(s => ({
          ...s,
          completed: s.completed + newlyCompleted,
          failed: s.failed + newlyFailed
        }));

        // Stop if all done
        if (next.every(s => s.status === 'SUCCESS' || s.status === 'DEGRADED' || s.status === 'FAILED')) {
          setIsRunning(false);
          clearInterval(interval);
        }

        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning, concurrency, slowSite, simulateFailure]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div>
          <h1 className="text-2xl font-light tracking-wider flex items-center gap-3">
            <Activity className="w-6 h-6 text-primary" />
            100-SITE SCALE LAB
          </h1>
          <p className="text-sm text-foreground/50 font-mono mt-1">Simulate concurrent monitoring engine load and failure isolation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-surface border border-surface-border p-4 rounded-lg space-y-4">
            <h3 className="font-mono text-sm tracking-widest text-primary border-b border-surface-border pb-2 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> TEST PARAMETERS
            </h3>
            
            <div>
              <label className="block text-xs font-mono text-foreground/70 mb-1">TOTAL WEBSITES</label>
              <input 
                type="number" value={totalSites} onChange={e => setTotalSites(parseInt(e.target.value))}
                disabled={isRunning}
                className="w-full bg-background border border-surface-border rounded-md px-3 py-1 text-sm font-mono focus:border-primary/50 focus:outline-none disabled:opacity-50" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono text-foreground/70 mb-1">CONCURRENCY</label>
              <input 
                type="number" value={concurrency} onChange={e => setConcurrency(parseInt(e.target.value))}
                disabled={isRunning}
                className="w-full bg-background border border-surface-border rounded-md px-3 py-1 text-sm font-mono focus:border-primary/50 focus:outline-none disabled:opacity-50" 
              />
            </div>

            <div className="pt-2 space-y-2 border-t border-surface-border">
              <label className="flex items-center gap-2 text-xs font-mono text-foreground/70 cursor-pointer">
                <input type="checkbox" checked={slowSite} onChange={e => setSlowSite(e.target.checked)} disabled={isRunning} />
                SIMULATE SLOW SOURCE (Site 17)
              </label>
              <label className="flex items-center gap-2 text-xs font-mono text-foreground/70 cursor-pointer">
                <input type="checkbox" checked={simulateFailure} onChange={e => setSimulateFailure(e.target.checked)} disabled={isRunning} />
                SIMULATE FAILURES
              </label>
            </div>

            <button 
              onClick={startTest}
              disabled={isRunning}
              className="w-full bg-primary hover:bg-primary-light disabled:opacity-50 disabled:hover:bg-primary text-primary-foreground px-4 py-2 rounded-md font-mono text-sm tracking-wider flex items-center justify-center gap-2 mt-4 transition-colors shadow-[0_0_15px_rgba(0,200,255,0.2)]"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isRunning ? "RUNNING SIMULATION..." : "START TEST"}
            </button>
          </div>

          <div className="bg-surface border border-surface-border p-4 rounded-lg space-y-4">
             <h3 className="font-mono text-sm tracking-widest text-primary border-b border-surface-border pb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> METRICS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-mono text-foreground/50 block">COMPLETED</span>
                <span className="text-xl font-light text-success">{stats.completed}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-foreground/50 block">FAILURES</span>
                <span className="text-xl font-light text-warning">{stats.failed}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-foreground/50 block">QUEUE WAIT</span>
                <span className="text-xl font-light text-primary">~1.2s</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-foreground/50 block">WORKER UTIL</span>
                <span className="text-xl font-light text-primary">{isRunning ? '100%' : '0%'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 bg-surface border border-surface-border p-6 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-mono tracking-widest text-foreground/70">WORKER POOL EXECUTION GRID</h3>
            <div className="flex gap-4 text-[10px] font-mono">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-surface-border"/> QUEUED</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-primary"/> RUNNING</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-success"/> SUCCESS</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-warning animate-pulse"/> RETRYING</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-danger"/> FAILED</span>
            </div>
          </div>

          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {sites.length === 0 ? (
              <div className="col-span-full py-20 text-center font-mono text-sm text-foreground/40 border border-dashed border-surface-border rounded-lg">
                Click START TEST to begin simulation
              </div>
            ) : (
              sites.map((site) => (
                <motion.div 
                  key={site.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "aspect-square rounded border flex flex-col items-center justify-center relative overflow-hidden transition-colors",
                    site.status === 'QUEUED' && "bg-background border-surface-border text-foreground/30",
                    site.status === 'RUNNING' && "bg-primary/20 border-primary/50 text-primary shadow-[0_0_10px_rgba(0,200,255,0.2)]",
                    site.status === 'SUCCESS' && "bg-success/10 border-success/30 text-success",
                    site.status === 'RETRYING' && "bg-warning/20 border-warning/50 text-warning animate-pulse",
                    site.status === 'FAILED' || site.status === 'DEGRADED' && "bg-danger/10 border-danger/30 text-danger",
                  )}
                >
                  <span className="text-xs font-mono">#{site.id}</span>
                  {(site.status === 'RUNNING' || site.status === 'RETRYING') && (
                    <div className="absolute bottom-0 left-0 h-1 bg-primary/50 transition-all duration-500 ease-linear" style={{ width: `${Math.min(100, (site.duration / 1500) * 100)}%`}} />
                  )}
                  {site.status === 'RETRYING' && <AlertTriangle className="absolute top-1 right-1 w-2 h-2 text-warning" />}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
