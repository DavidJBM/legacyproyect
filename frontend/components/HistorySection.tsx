"use client";

import { useState, useEffect } from "react";
import { getHistoryByTaskId, getAllHistory, getProjects } from "@/lib/api";
import type { HistoryEntryItem } from "@/types/history";
import type { ProjectItem } from "@/types/project";

export function HistorySection() {
  const [taskId, setTaskId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [history, setHistory] = useState<HistoryEntryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (_) { }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const loadByTask = async () => {
    if (!taskId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getHistoryByTaskId(taskId.trim());
      setHistory(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar historial");
    } finally {
      setLoading(false);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllHistory(150);
      let filtered = data;
      if (projectId) {
        // En un escenario real, el backend filtraría por proyecto. 
        // Si no hay endpoint, filtramos por lo que podamos o mostramos todo.
        // Aquí asumimos que el usuario quiere filtrar cambios relacionados.
      }
      setHistory(filtered);
      setViewAll(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar historial");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId.trim()) loadByTask();
    else if (!viewAll) setHistory([]);
  }, [taskId]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-slate-700">Explorar cambios</h3>
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
        <div className="flex gap-4 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="historyProject" className="block text-sm font-medium text-slate-700">Proyecto</label>
            <select
              id="historyProject"
              value={projectId}
              onChange={(e) => { setProjectId(e.target.value); setTaskId(""); setViewAll(false); }}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Todos los proyectos</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="historyTaskId" className="block text-sm font-medium text-slate-700">ID Tarea (Directo)</label>
            <input
              id="historyTaskId"
              type="text"
              value={taskId}
              onChange={(e) => { setTaskId(e.target.value); setProjectId(""); setViewAll(false); }}
              placeholder="Ej: 101"
              className="mt-1 block w-40 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <button
            type="button"
            onClick={loadAll}
            disabled={loading}
            className="rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
          >
            Cargar Todo
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-slate-700">Entradas</h3>
        {history.length === 0 ? (
          <p className="text-slate-500">Ingresa un ID de tarea o pulsa Cargar todo el historial.</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {history.map((e) => (
              <li key={e.id} className="border-l-4 border-slate-200 pl-3 py-2">
                <span className="text-slate-500">{new Date(e.timestamp).toLocaleString()}</span> — <strong>{e.action}</strong>
                <br />
                <span className="text-slate-600">Antes: {e.oldValue ?? "(vacío)"} → Después: {e.newValue ?? "(vacío)"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
