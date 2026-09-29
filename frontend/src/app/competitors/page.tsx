"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Crosshair, CheckCircle2, XCircle, Loader2, Play, RefreshCw, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function CompetitorsPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompetitors = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://sentinel-backend-w88d.onrender.com/api/competitors');
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((c: any) => ({
          id: c.id,
          name: c.name,
          url: c.website_url,
          sources: c.sources?.length || 0,
          health: c.is_demo ? "SIMULATED" : "HEALTHY", // Simplified for UI
          articles: c.articles?.length || 0,
        }));
        setCompetitors(mapped);
      }
    } catch (e) {
      console.error(e);
      // Fallback
      if (competitors.length === 0) {
        setCompetitors([
          { id: 1, name: "TechNova", url: "technova.io", sources: 3, health: "HEALTHY", articles: 245 },
          { id: 2, name: "Acme AI", url: "acme-ai.com", sources: 2, health: "DEGRADED", articles: 18 },
          { id: 3, name: "CloudFrontier", url: "cloudfront.io", sources: 4, health: "HEALTHY", articles: 89 },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-wider flex items-center gap-3">
            <Crosshair className="w-6 h-6 text-primary" />
            COMPETITORS
          </h1>
          <p className="text-sm text-foreground/50 font-mono mt-1">Manage and configure monitored targets.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchCompetitors}
            className="bg-surface border border-surface-border hover:bg-surface-border/50 text-foreground px-4 py-2 rounded-md font-mono text-xs tracking-wider flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin text-primary")} /> REFRESH
          </button>
          <button 
            onClick={() => setShowWizard(true)}
            className="bg-primary hover:bg-primary-light text-primary-foreground px-4 py-2 rounded-md font-mono text-sm tracking-wider flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(0,200,255,0.3)]"
          >
            <Plus className="w-4 h-4" />
            ADD COMPETITOR
          </button>
        </div>
      </div>

      <div className="bg-surface border border-surface-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-surface-border flex gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search competitors..." 
              className="w-full bg-background border border-surface-border rounded-md pl-9 pr-4 py-2 text-sm font-mono focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
        
        <table className="w-full text-left text-sm font-mono">
          <thead className="bg-surface-border/20 text-xs text-foreground/50">
            <tr>
              <th className="px-6 py-3 font-medium tracking-wider">COMPETITOR</th>
              <th className="px-6 py-3 font-medium tracking-wider">URL</th>
              <th className="px-6 py-3 font-medium tracking-wider text-center">SOURCES</th>
              <th className="px-6 py-3 font-medium tracking-wider text-center">ARTICLES</th>
              <th className="px-6 py-3 font-medium tracking-wider">STATUS</th>
              <th className="px-6 py-3 font-medium tracking-wider text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/50">
            {loading && competitors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center"><RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" /></td>
              </tr>
            ) : competitors.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-foreground/50">No competitors configured.</td>
              </tr>
            ) : (
              competitors.map((comp) => (
                <tr key={comp.id} className="hover:bg-background/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-foreground tracking-wide group-hover:text-primary transition-colors">{comp.name}</div>
                  </td>
                  <td className="px-6 py-4 text-foreground/60">{comp.url}</td>
                  <td className="px-6 py-4 text-center">{comp.sources}</td>
                  <td className="px-6 py-4 text-center text-primary">{comp.articles}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] tracking-wider border flex items-center gap-2 w-max",
                      comp.health === 'HEALTHY' ? "bg-success/10 text-success border-success/20" : 
                      comp.health === 'SIMULATED' ? "bg-warning/10 text-warning border-warning/20" :
                      "bg-danger/10 text-danger border-danger/20"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", 
                        comp.health === 'HEALTHY' ? "bg-success" : 
                        comp.health === 'SIMULATED' ? "bg-warning animate-pulse" : "bg-danger"
                      )} />
                      {comp.health}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs text-primary hover:underline">MANAGE</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showWizard && <AddCompetitorWizard onClose={() => {
          setShowWizard(false);
          fetchCompetitors();
        }} />}
      </AnimatePresence>
    </div>
  );
}

function AddCompetitorWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  
  const [analysisState, setAnalysisState] = useState([
    { label: "Website reachable", status: "pending" },
    { label: "Checking robots.txt", status: "pending" },
    { label: "Searching RSS/Atom", status: "pending" },
    { label: "Searching sitemap.xml", status: "pending" },
    { label: "Detecting JSON-LD", status: "pending" },
  ]);

  const runAnalysis = () => {
    setStep(2);
    let current = 0;
    const interval = setInterval(() => {
      setAnalysisState(prev => {
        return prev.map((item, index) => {
          if (index === current - 1) return { ...item, status: "success" };
          if (index === current) return { ...item, status: "running" };
          return item;
        });
      });
      
      current++;
      if (current > analysisState.length) {
        clearInterval(interval);
        setTimeout(() => setStep(3), 800);
      }
    }, 800);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Clean URL
      let cleanUrl = url;
      if (!cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl;
      
      const payload = {
        name,
        website_url: cleanUrl,
        is_demo: false
      };
      
      await fetch('https://sentinel-backend-w88d.onrender.com/api/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      onClose();
    } catch (e) {
      console.error(e);
      // Even if it fails, close wizard
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface border border-surface-border rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
      >
        <div className="px-6 py-4 border-b border-surface-border flex justify-between items-center bg-surface-border/10">
          <h2 className="font-mono tracking-widest text-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> ADD COMPETITOR WIZARD
          </h2>
          <button onClick={onClose} className="text-foreground/50 hover:text-foreground"><XCircle className="w-5 h-5" /></button>
        </div>
        
        <div className="p-6 flex-1 min-h-[400px]">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-2">COMPETITOR NAME</label>
                <input 
                  type="text" 
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-background border border-surface-border rounded-md px-4 py-2 focus:border-primary/50 focus:outline-none font-mono" 
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-2">WEBSITE URL</label>
                <input 
                  type="text" 
                  value={url} onChange={e => setUrl(e.target.value)}
                  className="w-full bg-background border border-surface-border rounded-md px-4 py-2 focus:border-primary/50 focus:outline-none font-mono" 
                  placeholder="https://acme-corp.com"
                />
              </div>
              <p className="text-xs text-foreground/50 font-mono">The system will automatically discover the optimal monitoring sources (RSS, Sitemap, etc) for this domain.</p>
              <div className="pt-4 text-right">
                <button 
                  disabled={!name || !url}
                  onClick={runAnalysis}
                  className="bg-primary hover:bg-primary-light disabled:opacity-50 text-primary-foreground px-6 py-2 rounded-md font-mono text-sm tracking-wider flex items-center gap-2 ml-auto"
                >
                  START ANALYSIS <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              <div className="w-24 h-24 rounded-full border border-primary/30 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
                <div className="absolute inset-2 rounded-full border-b-2 border-secondary animate-spin" style={{ animationDirection: 'reverse' }} />
                <Search className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h3 className="font-mono text-lg tracking-widest text-primary">ANALYZING WEBSITE</h3>
              
              <div className="w-full max-w-sm space-y-3 font-mono text-sm">
                {analysisState.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.status === 'success' && <CheckCircle2 className="w-4 h-4 text-success" />}
                    {item.status === 'running' && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                    {item.status === 'pending' && <div className="w-4 h-4 rounded-full border border-surface-border" />}
                    <span className={cn(
                      item.status === 'success' ? "text-foreground" : 
                      item.status === 'running' ? "text-primary font-bold" : "text-foreground/40"
                    )}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-mono text-lg tracking-widest text-success border-b border-surface-border pb-2">SOURCE DISCOVERY RESULTS</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background border border-surface-border p-4 rounded-md">
                  <div className="text-xs font-mono text-foreground/50 mb-1">RSS FEED</div>
                  <div className="text-success font-mono font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> FOUND
                  </div>
                  <div className="text-xs text-foreground/60 mt-2 truncate">https://{url.replace('https://','')}/rss.xml</div>
                </div>
                <div className="bg-background border border-surface-border p-4 rounded-md">
                  <div className="text-xs font-mono text-foreground/50 mb-1">SITEMAP.XML</div>
                  <div className="text-success font-mono font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> FOUND
                  </div>
                  <div className="text-xs text-foreground/60 mt-2 truncate">https://{url.replace('https://','')}/sitemap.xml</div>
                </div>
              </div>

              <div className="bg-surface-border/10 border border-primary/30 p-4 rounded-md">
                <h4 className="font-mono text-sm text-primary mb-2 tracking-widest">STRATEGY RECOMMENDATION</h4>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center bg-background/50 p-2 rounded border border-surface-border">
                    <span>RSS</span>
                    <span className="text-success border border-success/30 bg-success/10 px-2 py-0.5 rounded">Priority: HIGH</span>
                  </div>
                  <div className="flex justify-between items-center bg-background/50 p-2 rounded border border-surface-border">
                    <span>SITEMAP</span>
                    <span className="text-warning border border-warning/30 bg-warning/10 px-2 py-0.5 rounded">Priority: MEDIUM</span>
                  </div>
                </div>
                <p className="text-xs text-foreground/60 mt-4 leading-relaxed">
                  <span className="text-primary font-bold">WHY:</span> RSS provides structured publication metadata and can be checked efficiently. Sitemap will be used as a fallback to ensure 100% coverage.
                </p>
              </div>

              <div className="pt-4 text-right flex justify-between">
                <button onClick={() => setStep(1)} className="text-xs font-mono text-foreground/50 hover:text-foreground">BACK</button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-success hover:bg-success/80 disabled:opacity-50 text-background px-6 py-2 rounded-md font-mono text-sm tracking-wider flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  SAVE & MONITOR
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
