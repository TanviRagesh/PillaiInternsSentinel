"use client";

import { Bell, User } from "lucide-react";
import { useEffect, useState } from "react";

export function TopBar() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-surface/50 backdrop-blur-sm border-b border-surface-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold tracking-wide">Command Center</h2>
        <span className="text-sm text-foreground/50 hidden md:block">Real-time visibility into competitor publishing activity.</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 text-sm font-mono bg-surface-border/30 px-3 py-1.5 rounded-md border border-surface-border">
          <div className={`w-2 h-2 rounded-full bg-success transition-opacity duration-1000 ${pulse ? 'opacity-100 shadow-[0_0_8px_var(--color-success)]' : 'opacity-50'}`} />
          <span className="text-success tracking-wider">SYSTEM OPERATIONAL</span>
          <span className="text-foreground/30 mx-2">|</span>
          <span className="text-foreground/70">LAST CYCLE 18s AGO</span>
        </div>

        <button className="relative p-2 text-foreground/60 hover:text-foreground transition-colors rounded-full hover:bg-surface-border/50">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>

        <div className="w-8 h-8 rounded-full bg-surface-border flex items-center justify-center border border-primary/30">
          <User className="w-4 h-4 text-primary" />
        </div>
      </div>
    </header>
  );
}
