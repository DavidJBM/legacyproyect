"use client";

export type TabId = "tasks" | "projects" | "comments" | "history" | "notifications" | "search" | "reports";

const TABS: { id: TabId; label: string }[] = [
  { id: "tasks", label: "Tareas" },
  { id: "projects", label: "Proyectos" },
  { id: "comments", label: "Comentarios" },
  { id: "history", label: "Historial" },
  { id: "notifications", label: "Notificaciones" },
  { id: "search", label: "Búsqueda" },
  { id: "reports", label: "Reportes" },
];

interface DashboardTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <nav className="flex gap-0" aria-label="Tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === tab.id
                ? "border-slate-900 text-slate-900 bg-white"
                : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800 bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
