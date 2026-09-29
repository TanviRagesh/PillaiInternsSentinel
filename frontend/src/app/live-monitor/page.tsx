"use client";

import { useState, useEffect } from "react";
import { Eye, Network, RefreshCw, Zap, Clock, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveMonitorPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Initialize network nodes
  useEffect(() => {
    const initialNodes = Array.from({ length: 15 }).map((_, i) => ({
      id: `node-${i}`,
      name: `SITE ${String(i + 1).padStart(2, '0')}`,
      status: 'HEALTHY',
      lastCheck: '12s ago',
      nextCheck: '48s',
      response: `${Math.floor(Math.random() * 500) + 100}ms`,
      method: ['RSS', 'SITEMAP', 'DIRECT'][Math.floor(Math.random() * 3)],
      articles: Math.floor(Math.random() * 50),
      failures: 0,
    }));
    setNodes(initialNodes);

    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        // Randomly change node state to simulate live checking
        const rand = Math.random();
        let newStatus = node.status;
        
        if (node.status === 'HEALTHY' && rand > 0.8) newStatus = 'CHECKING';
        else if (node.status === 'CHECKING' && rand > 0.4) newStatus = 'HEALTHY';
        else if (node.status === 'HEALTHY' && rand > 0.98) newStatus = 'FAILED';
        else if (node.status === 'FAILED' && rand > 0.5) newStatus = 'RETRYING';
        else if (node.status === 'RETRYING' && rand > 0.3) newStatus = 'HEALTHY';

        return { ...node, status: newStatus };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex items-center justify-between border-b border-surface-border pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-light tracking-wider flex items-center gap-3">
            <Eye className="w-6 h-6 text-primary" />
            LIVE MONITOR
          </h1>
          <p className="text-sm text-foreground/50 font-mono mt-1">Watch the intelligence network operate in real time.</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-primary animate-pulse"/> CHECKING</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-success"/> HEALTHY</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-warning"/> RETRYING</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-danger"/> FAILED</span>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Network Grid */}
        <div className="flex-1 bg-surface border border-surface-border rounded-lg relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background opacity-50" />
          
          <div className="relative z-10 w-full max-w-4xl p-8 grid grid-cols-5 gap-8">
            {nodes.map(node => (
              <motion.div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={cn(
                  "relative flex flex-col items-center justify-center cursor-pointer group",
                )}
              >
                {/* Connection lines (decorative) */}
                <div className="absolute w-full h-[1px] bg-surface-border/50 top-1/2 left-1/2 -z-10" />
                <div className="absolute h-full w-[1px] bg-surface-border/50 left-1/2 top-1/2 -z-10" />

                <div className={cn(
                  "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-lg",
                  node.status === 'HEALTHY' && "bg-background border-success text-success",
                  node.status === 'CHECKING' && "bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(0,200,255,0.4)] animate-pulse scale-110",
                  node.status === 'RETRYING' && "bg-warning/20 border-warning text-warning animate-pulse",
                  node.status === 'FAILED' && "bg-danger/20 border-danger text-danger",
                  selectedNode?.id === node.id && "ring-4 ring-primary/30 ring-offset-2 ring-offset-background"
                )}>
                  {node.status === 'CHECKING' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Network className="w-5 h-5" />}
                </div>
                <div className="mt-3 text-xs font-mono tracking-widest text-foreground/70 group-hover:text-foreground transition-colors">
                  {node.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Node Details Panel */}
        <div className="w-80 shrink-0 bg-surface border border-surface-border rounded-lg p-6 flex flex-col">
          <h3 className="text-sm font-mono tracking-widest text-primary border-b border-surface-border pb-4 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" /> NODE DIAGNOSTICS
          </h3>
          
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-xl font-light mb-1">{selectedNode.name}</h4>
                  <div className={cn(
                    "inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-mono border",
                    selectedNode.status === 'HEALTHY' && "bg-success/10 text-success border-success/30",
                    selectedNode.status === 'CHECKING' && "bg-primary/10 text-primary border-primary/30",
                    selectedNode.status === 'RETRYING' && "bg-warning/10 text-warning border-warning/30",
                    selectedNode.status === 'FAILED' && "bg-danger/10 text-danger border-danger/30",
                  )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", 
                      selectedNode.status === 'HEALTHY' ? "bg-success" : 
                      selectedNode.status === 'CHECKING' ? "bg-primary animate-pulse" : 
                      selectedNode.status === 'RETRYING' ? "bg-warning" : "bg-danger"
                    )} />
                    {selectedNode.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background border border-surface-border p-3 rounded-md">
                    <span className="block text-[10px] font-mono text-foreground/50 mb-1">LAST CHECK</span>
                    <span className="font-mono text-sm">{selectedNode.lastCheck}</span>
                  </div>
                  <div className="bg-background border border-surface-border p-3 rounded-md">
                    <span className="block text-[10px] font-mono text-foreground/50 mb-1">NEXT CHECK</span>
                    <span className="font-mono text-sm text-primary">{selectedNode.nextCheck}</span>
                  </div>
                  <div className="bg-background border border-surface-border p-3 rounded-md">
                    <span className="block text-[10px] font-mono text-foreground/50 mb-1">RESPONSE</span>
                    <span className="font-mono text-sm text-success">{selectedNode.response}</span>
                  </div>
                  <div className="bg-background border border-surface-border p-3 rounded-md">
                    <span className="block text-[10px] font-mono text-foreground/50 mb-1">STRATEGY</span>
                    <span className="font-mono text-sm text-secondary">{selectedNode.method}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-surface-border">
                  <div className="flex justify-between items-center text-sm font-mono">
                    <span className="text-foreground/50">Articles Detected</span>
                    <span className="text-foreground">{selectedNode.articles}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-mono">
                    <span className="text-foreground/50">Consecutive Failures</span>
                    <span className="text-foreground">{selectedNode.failures}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-mono">
                    <span className="text-foreground/50">Worker Node</span>
                    <span className="text-primary">W-04</span>
                  </div>
                </div>

                <button className="w-full mt-4 bg-background border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground py-2 rounded font-mono text-xs tracking-widest transition-colors">
                  FORCE MANUAL CHECK
                </button>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-foreground/40 font-mono text-xs space-y-4 pt-12">
                <Network className="w-8 h-8 opacity-50" />
                <p>Select a node in the network grid to view real-time diagnostics.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
