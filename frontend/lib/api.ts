/**
 * Cliente API para el backend .NET (reemplaza Storage del legacy app.js).
 */
import type { TaskItem, CreateTaskRequest } from "@/types/task";
import type { ProjectItem, CreateProjectRequest } from "@/types/project";
import type { CommentItem, AddCommentRequest } from "@/types/comment";
import type { HistoryEntryItem } from "@/types/history";
import type { NotificationItem } from "@/types/notification";
import type { UserItem } from "@/types/user";

const API = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? "/api/backend" : "http://localhost:5000/api");


function getHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function url(path: string) {
  return `${API}${path}`;
}

// ——— Tareas ———
export async function getTasks(): Promise<TaskItem[]> {
  const res = await fetch(url("/Tasks"), {
    cache: "no-store",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Error al cargar tareas");
  return res.json();
}

export async function getTaskById(id: string): Promise<TaskItem> {
  const res = await fetch(url(`/Tasks/${id}`), {
    cache: "no-store",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Tarea no encontrada");
  return res.json();
}

export async function searchTasks(params: { search?: string; status?: string; priority?: string; projectId?: string }): Promise<TaskItem[]> {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  if (params.status) q.set("status", params.status);
  if (params.priority) q.set("priority", params.priority);
  if (params.projectId) q.set("projectId", params.projectId);
  const res = await fetch(url(`/Tasks?${q}`), {
    cache: "no-store",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Error al buscar tareas");
  return res.json();
}

export async function createTask(request: CreateTaskRequest): Promise<TaskItem> {
  const res = await fetch(url("/Tasks"), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error al crear tarea");
  }
  return res.json();
}

export async function updateTask(id: string, request: CreateTaskRequest): Promise<void> {
  const res = await fetch(url(`/Tasks/${id}`), {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error("Error al actualizar tarea");
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(url(`/Tasks/${id}`), {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Error al eliminar tarea");
}

// ——— Proyectos ———
export async function getProjects(): Promise<ProjectItem[]> {
  const res = await fetch(url("/Projects"), {
    cache: "no-store",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Error al cargar proyectos");
  return res.json();
}

export async function createProject(request: CreateProjectRequest): Promise<ProjectItem> {
  const res = await fetch(url("/Projects"), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error("Error al crear proyecto");
  return res.json();
}

export async function updateProject(id: string, request: CreateProjectRequest): Promise<void> {
  const res = await fetch(url(`/Projects/${id}`), {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error("Error al actualizar proyecto");
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(url(`/Projects/${id}`), {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Error al eliminar proyecto");
}

// ——— Comentarios ———
export async function getCommentsByTaskId(taskId: string): Promise<CommentItem[]> {
  const res = await fetch(url(`/Comments/task/${taskId}`), {
    cache: "no-store",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Error al cargar comentarios");
  return res.json();
}

export async function addComment(request: AddCommentRequest): Promise<CommentItem> {
  const res = await fetch(url("/Comments"), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error("Error al agregar comentario");
  return res.json();
}

// ——— Historial ———
export async function getHistoryByTaskId(taskId: string): Promise<HistoryEntryItem[]> {
  const res = await fetch(url(`/History/task/${taskId}`), {
    cache: "no-store",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Error al cargar historial");
  return res.json();
}

export async function getAllHistory(limit = 100): Promise<HistoryEntryItem[]> {
  const res = await fetch(url(`/History?limit=${limit}`), {
    cache: "no-store",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Error al cargar historial");
  return res.json();
}

// ——— Notificaciones ———
export async function getNotificationsByUserId(userId: string, unreadOnly = true): Promise<NotificationItem[]> {
  const res = await fetch(url(`/Notifications/user/${userId}?unreadOnly=${unreadOnly}`), {
    cache: "no-store",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Error al cargar notificaciones");
  return res.json();
}

export async function markNotificationsRead(userId: string): Promise<void> {
  const res = await fetch(url(`/Notifications/user/${userId}/mark-read`), {
    method: "POST",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Error al marcar notificaciones");
}

// ——— Reportes ———
export async function getReportTasks(): Promise<Record<string, number>> {
  const res = await fetch(url("/Reports/tasks"), {
    cache: "no-store",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Error al cargar reporte");
  return res.json();
}

export async function getReportProjects(): Promise<{ projectName: string; taskCount: number }[]> {
  const res = await fetch(url("/Reports/projects"), {
    cache: "no-store",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Error al cargar reporte");
  return res.json();
}

export async function getReportUsers(): Promise<{ userId: string; taskCount: number }[]> {
  const res = await fetch(url("/Reports/users"), {
    cache: "no-store",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Error al cargar reporte");
  return res.json();
}

export async function exportReportCsv(): Promise<Blob> {
  const res = await fetch(url("/Reports/export/csv"), {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Error al exportar CSV");
  return res.blob();
}

export function getExportCsvUrl(): string {
  return url("/Reports/export/csv");
}

// ——— Usuarios ———
export async function getUsers(): Promise<UserItem[]> {
  const res = await fetch(url("/Users"), {
    cache: "no-store",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Error al cargar usuarios");
  return res.json();
}
