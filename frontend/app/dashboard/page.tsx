"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardTabs, type TabId } from "@/components/DashboardTabs";
import { TaskList } from "@/components/TaskList";
import { TaskCreateForm } from "@/components/TaskCreateForm";
import { ProjectsList } from "@/components/ProjectsList";
import { ProjectForm } from "@/components/ProjectForm";
import { CommentsSection } from "@/components/CommentsSection";
import { HistorySection } from "@/components/HistorySection";
import { NotificationsSection } from "@/components/NotificationsSection";
import { SearchSection } from "@/components/SearchSection";
import { ReportsSection } from "@/components/ReportsSection";
import { getTasks, getProjects } from "@/lib/api";
import type { TaskItem } from "@/types/task";
import type { ProjectItem } from "@/types/project";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("tasks");
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("1");
  const [username, setUsername] = useState<string>("Usuario");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");

    if (!token || !storedUserId) {
      router.push("/login");
    } else {
      setCurrentUserId(storedUserId);
      setUsername(storedUsername || "Usuario");
    }
  }, [router]);

  const refreshTasks = async () => {
    setLoadingTasks(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar tareas");
    } finally {
      setLoadingTasks(false);
    }
  };

  const refreshProjects = async () => {
    setLoadingProjects(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (_) { }
    finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  useEffect(() => {
    if (activeTab === "projects") refreshProjects();
  }, [activeTab]);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-slate-800">Task Manager — Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Tareas, Proyectos, Comentarios, Historial, Notificaciones, Búsqueda, Reportes</p>
        </div>
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {error && activeTab === "tasks" && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
        )}

        {activeTab === "tasks" && (
          <div className="grid gap-8 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <h2 className="mb-4 text-lg font-medium text-slate-700">Lista de Tareas</h2>
              {loadingTasks ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">Cargando tareas...</div>
              ) : (
                <TaskList tasks={tasks} onRefresh={refreshTasks} />
              )}
            </section>
            <section>
              <h2 className="mb-4 text-lg font-medium text-slate-700">Nueva Tarea</h2>
              <TaskCreateForm onCreated={refreshTasks} currentUserId={currentUserId} />
            </section>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="grid gap-8 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <h2 className="mb-4 text-lg font-medium text-slate-700">Lista de Proyectos</h2>
              {loadingProjects ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">Cargando proyectos...</div>
              ) : (
                <ProjectsList
                  projects={projects}
                  onRefresh={refreshProjects}
                  onSelect={setSelectedProject}
                  selectedId={selectedProject?.id ?? null}
                />
              )}
            </section>
            <section>
              <h2 className="mb-4 text-lg font-medium text-slate-700">Nuevo / Editar Proyecto</h2>
              <ProjectForm
                onCreated={refreshProjects}
                selectedProject={selectedProject}
                onClearSelection={() => setSelectedProject(null)}
              />
            </section>
          </div>
        )}

        {activeTab === "comments" && (
          <section>
            <h2 className="mb-4 text-lg font-medium text-slate-700">Comentarios de Tareas</h2>
            <CommentsSection currentUserId={currentUserId} />
          </section>
        )}

        {activeTab === "history" && (
          <section>
            <h2 className="mb-4 text-lg font-medium text-slate-700">Historial de Cambios</h2>
            <HistorySection />
          </section>
        )}

        {activeTab === "notifications" && (
          <section>
            <h2 className="mb-4 text-lg font-medium text-slate-700">Notificaciones</h2>
            <NotificationsSection currentUserId={currentUserId} />
          </section>
        )}

        {activeTab === "search" && (
          <section>
            <h2 className="mb-4 text-lg font-medium text-slate-700">Búsqueda Avanzada</h2>
            <SearchSection />
          </section>
        )}

        {activeTab === "reports" && (
          <section>
            <h2 className="mb-4 text-lg font-medium text-slate-700">Generación de Reportes</h2>
            <ReportsSection />
          </section>
        )}
      </div>
    </main>
  );
}
