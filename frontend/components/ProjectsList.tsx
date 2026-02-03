"use client";

import { useState } from "react";
import { deleteProject } from "@/lib/api";
import type { ProjectItem } from "@/types/project";

interface ProjectsListProps {
  projects: ProjectItem[];
  onRefresh: () => void;
  onSelect: (p: ProjectItem) => void;
  selectedId: string | null;
}

import { Trash2, Folder, ChevronRight, Users } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

export function ProjectsList({ projects, onRefresh, onSelect, selectedId }: ProjectsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm("Eliminar proyecto: " + name + "?")) return;
    setDeletingId(id);
    try {
      await deleteProject(id);
      onRefresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Folder className="text-slate-400" size={32} />
        </div>
        <p className="text-slate-500 font-medium">No hay proyectos activos.</p>
        <p className="text-slate-400 text-sm mt-1">Comienza creando uno nuevo para organizar tus tareas.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((p) => (
        <motion.div
          key={p.id}
          whileHover={{ y: -4 }}
          onClick={() => onSelect(p)}
          className={clsx(
            "glass-card p-6 cursor-pointer border-2 transition-all relative group",
            selectedId === p.id
              ? "border-primary-500 ring-4 ring-primary-500/10 shadow-lg"
              : "border-transparent border-white/20 hover:border-primary-500/30 shadow-premium"
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={clsx(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
              selectedId === p.id ? "bg-primary-500 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-500"
            )}>
              <Folder size={24} />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(p.id, p.name); }}
              disabled={deletingId === p.id}
              className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight">{p.name}</h3>
          <p className="text-sm text-slate-500 line-clamp-2 mb-6 min-h-[40px] leading-relaxed">
            {p.description || "Sin descripción proporcionada."}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
              <Users size={14} />
              <span>EQUIPO</span>
            </div>
            <div className="flex items-center gap-1 text-primary-600 text-sm font-bold">
              Ver detalles
              <ChevronRight size={16} />
            </div>
          </div>

          {selectedId === p.id && (
            <div className="absolute top-4 right-4 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-primary-500" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
