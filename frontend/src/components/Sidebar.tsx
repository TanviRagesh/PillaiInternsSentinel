"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  BarChart2, 
  Crosshair, 
  Eye, 
  FileText, 
  LayoutDashboard, 
  ListOrdered, 
  Server, 
  Settings, 
  ShieldAlert, 
  ActivitySquare
} from "lucide-react";

const navigation = [
  { name: "Command Center", section: "COMMAND CENTER", href: "/", icon: LayoutDashboard },
  { name: "Live Monitor", section: "COMMAND CENTER", href: "/live-monitor", icon: Eye },
  { name: "Competitors", section: "COMMAND CENTER", href: "/competitors", icon: Crosshair },
  { name: "Detections", section: "COMMAND CENTER", href: "/detections", icon: FileText },
  { name: "Analytics", section: "COMMAND CENTER", href: "/analytics", icon: BarChart2 },
  
  { name: "Monitoring Sources", section: "MONITORING", href: "/monitoring-sources", icon: ListOrdered },
  { name: "Monitoring Health", section: "MONITORING", href: "/monitoring-health", icon: ActivitySquare },
  
  { name: "Demo Lab", section: "SYSTEM", href: "/demo", icon: Server },
  { name: "100-Site Test", section: "SYSTEM", href: "/scale-test", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();

  const sections = Array.from(new Set(navigation.map(item => item.section)));

  return (
    <div className="w-64 bg-surface border-r border-surface-border h-screen sticky top-0 flex flex-col pt-4">
      <div className="px-6 mb-8">
        <h1 className="text-xl font-bold tracking-widest text-primary flex items-center gap-2">
          <ShieldAlert className="w-6 h-6" />
          SENTINEL
        </h1>
        <p className="text-xs text-foreground/50 mt-1 uppercase tracking-wider font-mono">
          Intelligence Network
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-8">
        {sections.map(section => (
          <div key={section}>
            <h3 className="px-2 text-xs font-mono font-semibold text-foreground/40 mb-3">
              {section}
            </h3>
            <div className="space-y-1">
              {navigation.filter(item => item.section === section).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-2 py-2 rounded-md transition-colors text-sm font-medium",
                      isActive 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-foreground/70 hover:bg-surface-border/50 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-foreground/50")} />
                    {item.name}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
