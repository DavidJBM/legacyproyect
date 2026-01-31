"use client";

import { useState } from "react";
import { deleteTask } from "@/lib/api";
import type { TaskItem } from "@/types/task";

interface TaskListProps {
  tasks: TaskItem[];
  onRefresh: () => void;
}

/**
 * Componente separado para la lista de tareas.
 * Equivalente conceptual a loadTasks() + tbody en app.js / index.html.
 */
export function TaskList({ tasks, onRefresh }: TaskListProps) {
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

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Pendiente: "bg-amber-100 text-amber-800",
      "En Progreso": "bg-blue-100 text-blue-800",
      Completada: "bg-emerald-100 text-emerald-800",
      Bloqueada: "bg-slate-100 text-slate-700",
      Cancelada: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
          styles[status] ?? "bg-slate-100 text-slate-700"
        }`}
      >
        {status || "Pendiente"}
      </span>
    );
  };

  const priorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      Baja: "text-slate-600",
      Media: "text-sky-600",
      Alta: "text-orange-600",
      Crítica: "text-red-600 font-medium",
    };
    return (
      <span className={`text-xs ${styles[priority] ?? "text-slate-600"}`}>
        {priority || "Media"}
      </span>
    );
  };

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        No hay tareas. Crea una desde el formulario.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Título
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Prioridad
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">
                Vencimiento
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="transition hover:bg-slate-50"
              >
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
                  {task.title}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  {statusBadge(task.status)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  {priorityBadge(task.priority)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
                  {task.dueDate || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                  <button
                    type="button"
                    onClick={() => handleDelete(task.id)}
                    disabled={deletingId === task.id}
                    className="rounded text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                  >
                    {deletingId === task.id ? "..." : "Eliminar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
