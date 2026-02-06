"use client";

import { useState, useEffect } from "react";
import { createTask, updateTask } from "@/lib/api";
import type { TaskItem, CreateTaskRequest } from "@/types/task";

interface TaskCreateFormProps {
  onSuccess: () => void;
  currentUserId: string;
  initialTask?: TaskItem | null;
  onCancel?: () => void;
}

/**
 * Componente para crear o editar tareas.
 */
export function TaskCreateForm({ onSuccess: onCreated, currentUserId, initialTask: task, onCancel }: TaskCreateFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Nueva");
  const [priority, setPriority] = useState("Media");
  const [dueDate, setDueDate] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "Nueva");
      setPriority(task.priority || "Media");
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
      setEstimatedHours(task.estimatedHours?.toString() || "");
    } else {
      resetForm();
    }
  }, [task]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("Nueva");
    setPriority("Media");
    setDueDate("");
    setEstimatedHours("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("El título es requerido.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const request: CreateTaskRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate || undefined,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : 0,
        createdByUserId: task ? task.createdByUserId : currentUserId,
        assignedToUserId: task?.assignedToUserId,
        projectId: task?.projectId,
      };

      if (task) {
        await updateTask(task.id, request);
      } else {
        await createTask(request);
      }

      resetForm();
      onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al procesar tarea");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h3 className="text-lg font-bold text-slate-800 mb-4">
        {task ? "Editar Tarea" : "Nueva Tarea"}
      </h3>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="taskTitle"
            className="block text-sm font-medium text-slate-700"
          >
            Título *
          </label>
          <input
            id="taskTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Título de la tarea"
          />
        </div>

        <div>
          <label
            htmlFor="taskDescription"
            className="block text-sm font-medium text-slate-700"
          >
            Descripción
          </label>
          <textarea
            id="taskDescription"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Descripción opcional"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="taskStatus"
              className="block text-sm font-medium text-slate-700"
            >
              Estado
            </label>
            <select
              id="taskStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option>Nueva</option>
              <option>En Progreso</option>
              <option>Completada</option>
              <option>Bloqueada</option>
              <option>Cancelada</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="taskPriority"
              className="block text-sm font-medium text-slate-700"
            >
              Prioridad
            </label>
            <select
              id="taskPriority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
              <option>Crítica</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="taskDueDate"
              className="block text-sm font-medium text-slate-700"
            >
              Vencimiento
            </label>
            <input
              id="taskDueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label
              htmlFor="taskHours"
              className="block text-sm font-medium text-slate-700"
            >
              Horas
            </label>
            <input
              id="taskHours"
              type="number"
              step="0.5"
              min="0"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-lg bg-primary-600 px-4 py-2.5 font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {submitting ? "Guardando..." : task ? "Guardar Cambios" : "Crear Tarea"}
          </button>
        </div>
      </div>
    </form>
  );
}
