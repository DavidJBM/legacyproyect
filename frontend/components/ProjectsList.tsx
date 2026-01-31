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
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500">
        No hay proyectos. Crea uno desde el formulario.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-600">Nombre</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-600">Descripción</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-600">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {projects.map((p) => (
            <tr
              key={p.id}
              onClick={() => onSelect(p)}
              className={"cursor-pointer transition hover:bg-slate-50 " + (selectedId === p.id ? "bg-primary-50" : "")}
            >
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">{p.name}</td>
              <td className="px-4 py-3 text-sm text-slate-500">{p.description || "—"}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleDelete(p.id, p.name); }}
                  disabled={deletingId === p.id}
                  className="text-red-600 hover:bg-red-50 rounded px-2 py-1 text-sm disabled:opacity-50"
                >
                  {deletingId === p.id ? "..." : "Eliminar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
