"use client";

import { useState, useEffect } from "react";
import { searchTasks, getProjects, getTaskById } from "@/lib/api";
import type { TaskItem } from "@/types/task";
import type { ProjectItem } from "@/types/project";

export function SearchSection() {
  const [searchText, setSearchText] = useState("");
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [results, setResults] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await searchTasks({
        search: searchText.trim() || undefined,
        status: status || undefined,
        priority: priority || undefined,
        projectId: projectId || undefined,
      });
      setResults(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al buscar");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-slate-700">Búsqueda avanzada</h3>
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
        <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <div>
            <label htmlFor="searchProject" className="block text-sm font-medium text-slate-700">Proyecto</label>
            <select
              id="searchProject"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              onFocus={loadProjects}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Todos los Proyectos</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="searchText" className="block text-sm font-medium text-slate-700">Texto de búsqueda</label>
            <input
              id="searchText"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Título o descripción"
            />
          </div>
          <div>
            <label htmlFor="searchStatus" className="block text-sm font-medium text-slate-700">Estado</label>
            <select
              id="searchStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Todos</option>
              <option>Nueva</option>
              <option>En Progreso</option>
              <option>Completada</option>
              <option>Bloqueada</option>
              <option>Cancelada</option>
            </select>
          </div>
          <div>
            <label htmlFor="searchPriority" className="block text-sm font-medium text-slate-700">Prioridad</label>
            <select
              id="searchPriority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Todas</option>
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
              <option>Crítica</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-transparent">Acción</label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </form>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-600">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-600">Título</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-600">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-600">Prioridad</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-600">Proyecto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {results.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">{t.id}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">{t.title}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">{t.status || "Nueva"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">{t.priority || "Media"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">{t.projectId ? (projects.find((p) => p.id === t.projectId)?.name ?? t.projectId) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {results.length === 0 && !loading && (
          <div className="p-8 text-center text-slate-500">Usa los filtros y pulsa Buscar para ver resultados.</div>
        )}
      </div>
    </div>
  );
}
