"use client";

import { useState } from "react";
import { getReportTasks, getReportProjects, getReportUsers, getExportCsvUrl } from "@/lib/api";

type ReportType = "tasks" | "projects" | "users" | null;

export function ReportsSection() {
  const [reportType, setReportType] = useState<ReportType>(null);
  const [tasksReport, setTasksReport] = useState<Record<string, number> | null>(null);
  const [projectsReport, setProjectsReport] = useState<{ projectName: string; taskCount: number }[] | null>(null);
  const [usersReport, setUsersReport] = useState<{ userId: string; taskCount: number }[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReport = async (type: "tasks" | "projects" | "users") => {
    setReportType(type);
    setLoading(true);
    setError(null);
    setTasksReport(null);
    setProjectsReport(null);
    setUsersReport(null);
    try {
      if (type === "tasks") {
        const data = await getReportTasks();
        setTasksReport(data);
      } else if (type === "projects") {
        const data = await getReportProjects();
        setProjectsReport(data);
      } else {
        const data = await getReportUsers();
        setUsersReport(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar reporte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-slate-700">Generación de reportes</h3>
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadReport("tasks")}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Reporte de Tareas
          </button>
          <button
            type="button"
            onClick={() => loadReport("projects")}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Reporte de Proyectos
          </button>
          <button
            type="button"
            onClick={() => loadReport("users")}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Reporte de Usuarios
          </button>
          <a
            href={getExportCsvUrl()}
            download="export_tasks.csv"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-primary-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-primary-700"
          >
            Exportar a CSV
          </a>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-slate-700">Resultado del reporte</h3>
        {loading && <p className="text-slate-500">Cargando...</p>}
        {!loading && reportType === "tasks" && tasksReport && (
          <pre className="whitespace-pre-wrap text-sm text-slate-800 font-sans">
            {Object.entries(tasksReport).map(([status, count]) => `${status}: ${count} tareas`).join("\n")}
          </pre>
        )}
        {!loading && reportType === "projects" && projectsReport && (
          <pre className="whitespace-pre-wrap text-sm text-slate-800 font-sans">
            {projectsReport.map((p) => `${p.projectName}: ${p.taskCount} tareas`).join("\n")}
          </pre>
        )}
        {!loading && reportType === "users" && usersReport && (
          <pre className="whitespace-pre-wrap text-sm text-slate-800 font-sans">
            {usersReport.map((u) => `Usuario ${u.userId}: ${u.taskCount} tareas asignadas`).join("\n")}
          </pre>
        )}
        {!loading && !reportType && !tasksReport && !projectsReport && !usersReport && (
          <p className="text-slate-500">Selecciona un tipo de reporte o exporta a CSV.</p>
        )}
      </div>
    </div>
  );
}
