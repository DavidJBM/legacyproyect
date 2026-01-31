/**
 * Tipos para tareas (alineados con el backend .NET / TaskDto).
 * Equivalente conceptual al objeto task del legacy app.js.
 */
export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId?: string | null;
  assignedToUserId?: string | null;
  dueDate?: string | null;
  estimatedHours: number;
  actualHours: number;
  createdByUserId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  projectId?: string | null;
  assignedToUserId?: string | null;
  dueDate?: string | null;
  estimatedHours?: number;
  createdByUserId?: string | null;
}
