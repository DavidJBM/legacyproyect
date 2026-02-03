"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, type TabId } from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { KanbanBoard } from "@/components/KanbanBoard";
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
  const [activeTab, setActiveTab] = useState<TabId>("kanban");
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("1");
  const [username, setUsername] = useState<string>("Usuario");

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    const storedUsername = typeof window !== "undefined" ? localStorage.getItem("username") : null;

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
    refreshProjects();
  }, []);

  const tabVariants = {
    initial: { opacity: 0, y: 10 },
    enter: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} username={username} />

      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-8 py-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {activeTab === "kanban" && "Tablero de Tareas"}
                {activeTab === "tasks" && "Gestión de Tareas"}
                {activeTab === "projects" && "Gestión de Proyectos"}
                {activeTab === "comments" && "Comunicaciones"}
                {activeTab === "history" && "Trazabilidad"}
                {activeTab === "notifications" && "Centro de Notificaciones"}
                {activeTab === "search" && "Explorador de Datos"}
                {activeTab === "reports" && "Análisis de Rendimiento"}
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Bienvenido, {username}. Tienes {tasks.filter(t => t.status !== "Completada").length} tareas pendientes.
              </p>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="w-full"
            >
              {error && (
                <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-800 backdrop-blur-sm flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  {error}
                </div>
              )}

              {activeTab === "kanban" && (
                <KanbanBoard tasks={tasks} onRefresh={refreshTasks} />
              )}

              {activeTab === "tasks" && (
                <div className="grid gap-8 lg:grid-cols-3">
                  <section className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-800">Todas las Tareas</h2>
                    </div>
                    {loadingTasks ? (
                      <div className="glass-card p-12 text-center text-slate-400">Cargando...</div>
                    ) : (
                      <TaskList tasks={tasks} onRefresh={refreshTasks} />
                    )}
                  </section>
                  <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800">Nueva Tarea</h2>
                    <div className="glass-card p-6">
                      <TaskCreateForm onCreated={refreshTasks} currentUserId={currentUserId} />
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "projects" && (
                <div className="grid gap-8 lg:grid-cols-3">
                  <section className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800">Portafolio de Proyectos</h2>
                    {loadingProjects ? (
                      <div className="glass-card p-12 text-center text-slate-400">Cargando...</div>
                    ) : (
                      <ProjectsList
                        projects={projects}
                        onRefresh={refreshProjects}
                        onSelect={setSelectedProject}
                        selectedId={selectedProject?.id ?? null}
                      />
                    )}
                  </section>
                  <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800">
                      {selectedProject ? "Editar Proyecto" : "Nuevo Proyecto"}
                    </h2>
                    <div className="glass-card p-6">
                      <ProjectForm
                        onCreated={refreshProjects}
                        selectedProject={selectedProject}
                        onClearSelection={() => setSelectedProject(null)}
                      />
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "comments" && (
                <section className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-800">Actividad Reciente</h2>
                  <div className="glass-card p-1">
                    <CommentsSection currentUserId={currentUserId} />
                  </div>
                </section>
              )}

              {activeTab === "history" && (
                <section className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-800">Bitácora de Eventos</h2>
                  <div className="glass-card p-1">
                    <HistorySection />
                  </div>
                </section>
              )}

              {activeTab === "notifications" && (
                <section className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-800">Tus Notificaciones</h2>
                  <div className="max-w-3xl">
                    <NotificationsSection currentUserId={currentUserId} />
                  </div>
                </section>
              )}

              {activeTab === "search" && (
                <section className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-800">Búsqueda Inteligente</h2>
                  <SearchSection />
                </section>
              )}

              {activeTab === "reports" && (
                <section className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-800">Estadísticas y Métricas</h2>
                  <ReportsSection />
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
