"use client";

import { useState, useEffect } from "react";
import { FileText, Search, Filter, Clock, ExternalLink, Zap, ChevronDown, CheckCircle2, AlertTriangle, Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function DetectionsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detections, setDetections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [targetFilter, setTargetFilter] = useState("ALL TARGETS");
  const [methodFilter, setMethodFilter] = useState("ALL METHODS");

  const fetchDetections = async () => {
    setLoading(true);
    try {
      let url = 'https://sentinel-backend-w88d.onrender.com/api/articles?limit=50';
      if (targetFilter === 'TARGET MET (< 5m)') url += '&target_met=true';
      if (targetFilter === 'TARGET EXCEEDED (> 5m)') url += '&target_met=false';
      if (methodFilter !== 'ALL METHODS') url += `&method=${methodFilter}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((a: any) => ({
          id: a.id,
          title: a.title,
          source: a.competitor_id,
          url: a.url,
          published: a.published_at ? new Date(a.published_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}) : 'UNKNOWN',
          detected: new Date(a.detected_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
          latency: a.detection_latency_seconds || 0,
          method: a.source_method,
          targetMet: a.target_met,
          summary: a.content_summary || "No AI summary available for this article.",
          topics: [] // In a real app, from enrichment table
        }));
        setDetections(mapped);
      }
    } catch (e) {
      console.error(e);
      // Fallback for demo if backend is entirely empty
      if (detections.length === 0) {
        setDetections([
          {
            id: 'mock1',
            title: "AI Agents Are Changing E-Commerce",
            source: "TECHCRUNCH",
            url: "https://techcrunch.com/ai-agents",
            published: "10:00:00",
            detected: "10:00:41",
            latency: 41,
            method: "RSS",
            targetMet: true,
            summary: "New AI agents are dramatically altering e-commerce landscapes by automating customer service and supply chain logistics, leading to a 40% reduction in operational overhead.",
            topics: ["AI", "E-Commerce", "Automation"]
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetections();
  }, [targetFilter, methodFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-wider flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            DETECTIONS
          </h1>
          <p className="text-sm text-foreground/50 font-mono mt-1">Intelligence feed of newly discovered competitor content.</p>
        </div>
        <button 
          onClick={fetchDetections}
          className="bg-surface border border-surface-border hover:bg-surface-border/50 text-foreground px-4 py-2 rounded-md font-mono text-xs tracking-wider flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin text-primary")} /> REFRESH FEED
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-surface border border-surface-border p-4 rounded-lg flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input 
            type="text" 
            placeholder="Search articles, competitors, topics..." 
            className="w-full bg-background border border-surface-border rounded-md pl-9 pr-4 py-2 text-sm font-mono focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={methodFilter} 
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-background border border-surface-border rounded-md px-3 py-2 text-xs font-mono focus:outline-none"
          >
            <option>ALL METHODS</option>
            <option>RSS</option>
            <option>SITEMAP</option>
            <option>DIRECT</option>
          </select>
          <select 
            value={targetFilter} 
            onChange={(e) => setTargetFilter(e.target.value)}
            className="bg-background border border-surface-border rounded-md px-3 py-2 text-xs font-mono focus:outline-none"
          >
            <option>ALL TARGETS</option>
            <option>TARGET MET ({'<'} 5m)</option>
            <option>TARGET EXCEEDED ({'>'} 5m)</option>
          </select>
          <button className="bg-background border border-surface-border rounded-md px-3 py-2 text-xs font-mono hover:bg-surface-border/50 transition-colors flex items-center gap-2">
            <Filter className="w-3 h-3" /> MORE FILTERS
          </button>
        </div>
      </div>

      {/* Detections Feed */}
      <div className="space-y-4">
        {loading && detections.length === 0 ? (
          <div className="py-20 flex justify-center"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>
        ) : detections.length === 0 ? (
          <div className="py-20 text-center font-mono text-sm text-foreground/50 border border-dashed border-surface-border rounded-lg bg-surface">
            NO DETECTIONS FOUND MATCHING FILTERS
          </div>
        ) : (
          detections.map((article) => (
            <div key={article.id} className="bg-surface border border-surface-border rounded-lg overflow-hidden transition-all duration-300 hover:border-primary/30">
              <div 
                className="p-5 cursor-pointer flex gap-6"
                onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
              >
                <div className="w-24 shrink-0 flex flex-col items-center justify-center border-r border-surface-border pr-6 space-y-2">
                  <span className="text-xs font-mono text-foreground/50">PUBLISHED</span>
                  <span className="text-sm font-mono">{article.published}</span>
                  <div className="w-full h-[1px] bg-surface-border/50 my-1" />
                  <span className="text-xs font-mono text-foreground/50">DETECTED</span>
                  <span className="text-sm font-mono text-primary">{article.detected}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono tracking-widest text-primary font-bold">{article.source}</span>
                      <div className="flex gap-1">
                        {article.topics?.map((t: string) => (
                          <span key={t} className="text-[9px] font-mono bg-surface-border px-1.5 py-0.5 rounded text-foreground/60">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded text-[10px] tracking-wider border flex items-center gap-1.5 font-mono",
                      article.targetMet ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"
                    )}>
                      {article.targetMet ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {article.targetMet ? "TARGET MET" : "TARGET EXCEEDED"}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-3 group-hover:text-primary transition-colors">{article.title}</h3>
                  
                  <div className="flex items-center gap-6 text-xs font-mono">
                    <span className="flex items-center gap-2 text-foreground/60">
                      <Zap className="w-3 h-3 text-secondary" /> METHOD: <span className="text-foreground">{article.method}</span>
                    </span>
                    <span className="flex items-center gap-2 text-foreground/60">
                      <Clock className="w-3 h-3 text-primary" /> LATENCY: 
                      <span className={article.targetMet ? "text-success" : "text-warning"}>
                        {Math.floor(article.latency/60).toString().padStart(2, '0')}:{(article.latency%60).toString().padStart(2, '0')}
                      </span>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center pl-4 border-l border-surface-border">
                  <ChevronDown className={cn("w-5 h-5 text-foreground/30 transition-transform duration-300", expandedId === article.id && "rotate-180")} />
                </div>
              </div>

              <AnimatePresence>
                {expandedId === article.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-surface-border/50 bg-background/50 overflow-hidden"
                  >
                    <div className="p-6 flex gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="bg-surface border border-primary/20 rounded p-4 relative">
                          <h4 className="text-xs font-mono text-primary flex items-center gap-2 mb-2 tracking-widest">
                            <Sparkles className="w-4 h-4" /> AI ENRICHMENT SUMMARY
                          </h4>
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {article.summary}
                          </p>
                        </div>
                        
                        <div className="flex gap-4 pt-2">
                          <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-mono tracking-wider hover:bg-primary-light transition-colors flex items-center gap-2">
                            VIEW FULL INTELLIGENCE <FileText className="w-3 h-3" />
                          </button>
                          <a href={article.url} target="_blank" rel="noopener noreferrer" className="bg-surface border border-surface-border hover:bg-surface-border/50 px-4 py-2 rounded text-xs font-mono tracking-wider transition-colors flex items-center gap-2">
                            OPEN SOURCE URL <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                      
                      <div className="w-64 shrink-0 space-y-4 border-l border-surface-border pl-6">
                        <h4 className="text-xs font-mono text-foreground/50 tracking-widest">DETECTION TIMELINE</h4>
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-1.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-border before:to-transparent">
                          
                          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-3 h-3 rounded-full border border-white bg-surface-border group-[.is-active]:bg-primary group-[.is-active]:border-primary shrink-0 z-10" />
                            <div className="w-[calc(100%-1.5rem)] ml-3 text-[10px] font-mono">
                              <div className="text-foreground/50 mb-0.5">{article.published}</div>
                              <div className="text-foreground">Article Published</div>
                            </div>
                          </div>
                          
                          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-3 h-3 rounded-full border border-white bg-surface-border group-[.is-active]:bg-success group-[.is-active]:border-success shrink-0 z-10" />
                            <div className="w-[calc(100%-1.5rem)] ml-3 text-[10px] font-mono">
                              <div className="text-foreground/50 mb-0.5">{article.detected}</div>
                              <div className="text-success">Discovered via {article.method}</div>
                            </div>
                          </div>

                          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-3 h-3 rounded-full border border-white bg-surface-border group-[.is-active]:bg-secondary group-[.is-active]:border-secondary shrink-0 z-10" />
                            <div className="w-[calc(100%-1.5rem)] ml-3 text-[10px] font-mono">
                              <div className="text-foreground/50 mb-0.5">+{article.latency}s</div>
                              <div className="text-secondary">AI Enrichment Complete</div>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
