"use client";

import { useState } from "react";
import { Server, PenTool, Send, Clock, PlayCircle, CheckCircle2, ChevronRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function DemoLabPage() {
  const [title, setTitle] = useState("The Future of AI Agents in Production");
  const [author, setAuthor] = useState("Jane Doe");
  const [content, setContent] = useState("AI agents are rapidly moving from research labs into production environments...");
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [demoState, setDemoState] = useState<'IDLE' | 'PUBLISHED' | 'DETECTING' | 'DETECTED'>('IDLE');
  const [metrics, setMetrics] = useState<any>(null);

  const handlePublish = () => {
    setIsPublishing(true);
    setDemoState('PUBLISHED');
    
    // Simulate publication and backend detection sequence
    setTimeout(() => {
      setIsPublishing(false);
      setDemoState('DETECTING');
      
      setTimeout(() => {
        setDemoState('DETECTED');
        const pubTime = new Date();
        const detTime = new Date(pubTime.getTime() + 37000); // 37 seconds later
        
        setMetrics({
          published: pubTime.toLocaleTimeString([], { hour12: false }),
          detected: detTime.toLocaleTimeString([], { hour12: false }),
          latency: 37,
          targetMet: true
        });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div>
          <h1 className="text-2xl font-light tracking-wider flex items-center gap-3">
            <Server className="w-6 h-6 text-primary" />
            DEMO LAB
          </h1>
          <p className="text-sm text-foreground/50 font-mono mt-1">Controlled environment for demonstrating detection latency.</p>
        </div>
        <div className="bg-warning/20 border border-warning/30 text-warning px-3 py-1 rounded text-xs font-mono tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-warning animate-pulse" /> SIMULATION ENVIRONMENT
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Article Creation */}
        <div className="bg-surface border border-surface-border rounded-lg p-6 flex flex-col">
          <h3 className="font-mono text-sm tracking-widest text-primary border-b border-surface-border pb-4 mb-6 flex items-center gap-2">
            <PenTool className="w-4 h-4" /> ACME AI LAB (DEMO COMPETITOR)
          </h3>
          
          <div className="space-y-5 flex-1">
            <div>
              <label className="block text-xs font-mono text-foreground/70 mb-2">ARTICLE TITLE</label>
              <input 
                type="text" value={title} onChange={e => setTitle(e.target.value)}
                disabled={isPublishing || demoState === 'DETECTED'}
                className="w-full bg-background border border-surface-border rounded-md px-4 py-2 font-mono text-sm focus:border-primary/50 focus:outline-none disabled:opacity-50" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-2">AUTHOR</label>
                <input 
                  type="text" value={author} onChange={e => setAuthor(e.target.value)}
                  disabled={isPublishing || demoState === 'DETECTED'}
                  className="w-full bg-background border border-surface-border rounded-md px-4 py-2 font-mono text-sm focus:border-primary/50 focus:outline-none disabled:opacity-50" 
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-foreground/70 mb-2">PUBLICATION TIME</label>
                <input 
                  type="text" value="NOW (Auto)" disabled
                  className="w-full bg-background border border-surface-border rounded-md px-4 py-2 font-mono text-sm text-foreground/50 cursor-not-allowed" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-mono text-foreground/70 mb-2">CONTENT</label>
              <textarea 
                value={content} onChange={e => setContent(e.target.value)}
                disabled={isPublishing || demoState === 'DETECTED'}
                rows={5}
                className="w-full bg-background border border-surface-border rounded-md px-4 py-2 font-mono text-sm focus:border-primary/50 focus:outline-none disabled:opacity-50 resize-none" 
              />
            </div>
          </div>

          <button 
            onClick={handlePublish}
            disabled={isPublishing || demoState !== 'IDLE'}
            className="w-full mt-6 bg-primary hover:bg-primary-light disabled:opacity-50 disabled:hover:bg-primary text-primary-foreground px-4 py-3 rounded-md font-mono tracking-wider flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(0,200,255,0.2)]"
          >
            {isPublishing ? (
              <>PUBLISHING... <Activity className="w-4 h-4 animate-spin" /></>
            ) : demoState !== 'IDLE' ? (
              <>TEST COMPLETED</>
            ) : (
              <>PUBLISH TEST ARTICLE <Send className="w-4 h-4" /></>
            )}
          </button>
          
          {demoState === 'DETECTED' && (
            <button 
              onClick={() => {
                setDemoState('IDLE');
                setMetrics(null);
                setTitle("Another Demo Article " + Math.floor(Math.random()*1000));
              }}
              className="w-full mt-2 bg-background border border-surface-border text-foreground/70 hover:text-foreground px-4 py-2 rounded-md font-mono text-xs tracking-wider transition-colors"
            >
              RESET DEMO
            </button>
          )}
        </div>

        {/* Right: Monitoring Visualization */}
        <div className="bg-surface border border-surface-border rounded-lg p-6 relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
          
          <h3 className="font-mono text-sm tracking-widest text-primary border-b border-surface-border pb-4 mb-8 flex items-center gap-2 relative z-10">
            <PlayCircle className="w-4 h-4" /> DETECTION SEQUENCE
          </h3>

          <div className="flex-1 space-y-8 relative z-10">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                demoState !== 'IDLE' ? "bg-success/20 border-success text-success" : "bg-background border-surface-border text-foreground/30"
              )}>
                1
              </div>
              <div className="pt-1">
                <h4 className={cn("font-mono font-bold tracking-widest", demoState !== 'IDLE' ? "text-success" : "text-foreground/40")}>
                  ARTICLE PUBLISHED
                </h4>
                <p className="text-xs font-mono text-foreground/50 mt-1">Source website updates its RSS and Sitemap.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                demoState === 'DETECTING' ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(0,200,255,0.4)] animate-pulse" : 
                demoState === 'DETECTED' ? "bg-success/20 border-success text-success" : 
                "bg-background border-surface-border text-foreground/30"
              )}>
                2
              </div>
              <div className="pt-1">
                <h4 className={cn(
                  "font-mono font-bold tracking-widest flex items-center gap-2", 
                  demoState === 'DETECTING' ? "text-primary" : 
                  demoState === 'DETECTED' ? "text-success" : "text-foreground/40"
                )}>
                  MONITORING ENGINE
                  {demoState === 'DETECTING' && <Activity className="w-4 h-4 animate-spin" />}
                </h4>
                <p className="text-xs font-mono text-foreground/50 mt-1">Workers polling Acme AI Lab endpoints.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                demoState === 'DETECTED' ? "bg-secondary/20 border-secondary text-secondary" : "bg-background border-surface-border text-foreground/30"
              )}>
                3
              </div>
              <div className="pt-1">
                <h4 className={cn("font-mono font-bold tracking-widest", demoState === 'DETECTED' ? "text-secondary" : "text-foreground/40")}>
                  INTELLIGENCE CAPTURED
                </h4>
                <p className="text-xs font-mono text-foreground/50 mt-1">Article parsed, deduplicated, and stored.</p>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <AnimatePresence>
            {metrics && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-background border border-surface-border rounded-lg p-4 relative z-10 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-2 opacity-10"><Clock className="w-24 h-24" /></div>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div>
                    <span className="block text-[10px] font-mono text-foreground/50 mb-1">PUBLISHED</span>
                    <span className="font-mono text-sm">{metrics.published}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-foreground/50 mb-1">DETECTED</span>
                    <span className="font-mono text-sm text-primary">{metrics.detected}</span>
                  </div>
                  <div className="col-span-2 pt-4 border-t border-surface-border flex items-end justify-between">
                    <div>
                      <span className="block text-[10px] font-mono text-foreground/50 mb-1">LATENCY</span>
                      <span className="font-light text-3xl text-success">
                        00:{metrics.latency.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-mono text-foreground/50 mb-1">TARGET (05:00)</span>
                      <span className="px-2 py-1 bg-success/10 border border-success/30 text-success text-[10px] font-mono rounded inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> TARGET MET
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
