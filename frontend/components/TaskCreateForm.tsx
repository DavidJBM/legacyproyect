"use client";

import { useState } from "react";
import { createTask } from "@/lib/api";
import type { CreateTaskRequest } from "@/types/task";

interface TaskCreateFormProps {
  onCreated: () => void;
}

/**
 * Componente separado para el formulario de creación de tareas.
 * Equivalente conceptual al formulario "Nueva/Editar Tarea" + addTask() en app.js / index.html.
 */
export function TaskCreateForm({ onCreated }: TaskCreateFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pendiente");
  const [priority, setPriority] = useState("Media");
  const [dueDate, setDueDate] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      };
      await createTask(request);
      setTitle("");
      setDescription("");
      setStatus("Pendiente");
      setPriority("Media");
      setDueDate("");
      setEstimatedHours("");
      onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear tarea");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
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
              <option>Pendiente</option>
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

        <div>
          <label
            htmlFor="taskDueDate"
            className="block text-sm font-medium text-slate-700"
          >
            Fecha de vencimiento
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
            Horas estimadas
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

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary-600 px-4 py-2.5 font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {submitting ? "Creando..." : "Crear tarea"}
        </button>
      </div>
    </form>
  );
}
