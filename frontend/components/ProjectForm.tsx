"use client";

import { useState, useEffect } from "react";
import { createProject, updateProject } from "@/lib/api";
import type { ProjectItem, CreateProjectRequest } from "@/types/project";

interface ProjectFormProps {
  onCreated: () => void;
  selectedProject: ProjectItem | null;
  onClearSelection: () => void;
}

export function ProjectForm({ onCreated, selectedProject, onClearSelection }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(selectedProject?.name ?? "");
    setDescription(selectedProject?.description ?? "");
  }, [selectedProject]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("El nombre es requerido."); return; }
    setError(null);
    setSubmitting(true);
    try {
      const request: CreateProjectRequest = { name: name.trim(), description: description.trim() || undefined };
      if (selectedProject) {
        await updateProject(selectedProject.id, request);
      } else {
        await createProject(request);
      }
      setName("");
      setDescription("");
      onClearSelection();
      onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      <div className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-slate-700">Nombre *</label>
          <input
            id="projectName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="projectDescription" className="block text-sm font-medium text-slate-700">Descripción</label>
          <textarea
            id="projectDescription"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-primary-700 disabled:opacity-50"
          >
            {submitting ? "..." : selectedProject ? "Actualizar" : "Agregar"}
          </button>
          {selectedProject && (
            <button type="button" onClick={onClearSelection} className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50">
              Limpiar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
