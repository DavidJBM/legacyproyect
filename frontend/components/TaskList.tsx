"use client";

import { useState } from "react";
import { deleteTask } from "@/lib/api";
import type { TaskItem } from "@/types/task";

interface TaskListProps {
  tasks: TaskItem[];
  onRefresh: () => void;
  onEditTask?: (task: TaskItem) => void;
}

/**
 * Componente separado para la lista de tareas.
 * Equivalente conceptual a loadTasks() + tbody en app.js / index.html.
 */
import { Trash2, Edit2, Calendar } from "lucide-react";
import { clsx } from "clsx";

export function TaskList({ tasks, onRefresh, onEditTask }: TaskListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta tarea?")) return;
    setDeletingId(id);
    try {
      await deleteTask(id);
      onRefresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setDeletingId(null);
    }
  };

  const statusStyle = (status: string) => {
    const map: Record<string, string> = {
      Nueva: "bg-slate-100 text-slate-600 border-slate-200",
      "En Progreso": "bg-primary-50 text-primary-700 border-primary-100",
      Completada: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Bloqueada: "bg-rose-50 text-rose-700 border-rose-100",
    };
    return map[status] || "bg-slate-50 text-slate-500 border-slate-100";
  };

  const priorityStyle = (priority: string) => {
    const map: Record<string, string> = {
      Alta: "text-rose-600",
      Media: "text-amber-600",
      Baja: "text-emerald-600",
    };
    return map[priority] || "text-slate-500";
  };

  if (tasks.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="text-slate-400" size={32} />
        </div>
        <p className="text-slate-500 font-medium">No se encontraron tareas en esta sección.</p>
        <p className="text-slate-400 text-sm mt-1">Crea una nueva desde el panel lateral derecho.</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Título y Descripción</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Estado</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Prioridad</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Vencimiento</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <tr key={task.id} className="group hover:bg-slate-50/80 transition-all">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800 leading-tight mb-0.5">{task.title}</span>
                    <span className="text-xs text-slate-500 line-clamp-1">{task.description}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className={clsx("px-2.5 py-1 rounded-lg text-[10px] font-bold border", statusStyle(task.status))}>
                      {task.status || "Nueva"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={clsx("w-1.5 h-1.5 rounded-full", priorityStyle(task.priority).replace('text', 'bg'))} />
                    <span className={clsx("text-xs font-semibold", priorityStyle(task.priority))}>
                      {task.priority || "Media"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                    <Calendar size={14} className="text-slate-300" />
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditTask?.(task)}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={deletingId === task.id}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
