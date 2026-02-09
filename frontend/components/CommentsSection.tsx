"use client";

import { useState, useEffect } from "react";
import { getCommentsByTaskId, addComment, getProjects, getTasks } from "@/lib/api";
import type { CommentItem, AddCommentRequest } from "@/types/comment";
import type { ProjectItem } from "@/types/project";
import type { TaskItem } from "@/types/task";

interface CommentsSectionProps {
  currentUserId: string;
}

export function CommentsSection({ currentUserId }: CommentsSectionProps) {
  const [projectId, setProjectId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskItem[]>([]);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInitialData = async () => {
    try {
      const [pData, tData] = await Promise.all([getProjects(), getTasks()]);
      setProjects(pData);
      setTasks(tData);
      setFilteredTasks(tData);
    } catch (_) { }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (projectId) {
      setFilteredTasks(tasks.filter(t => t.projectId === projectId));
    } else {
      setFilteredTasks(tasks);
    }
  }, [projectId, tasks]);

  const loadComments = async () => {
    if (!taskId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCommentsByTaskId(taskId.trim());
      setComments(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar comentarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId.trim()) loadComments();
    else setComments([]);
  }, [taskId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId.trim()) { setError("ID de tarea requerido"); return; }
    if (!commentText.trim()) { setError("El comentario no puede estar vacío"); return; }
    setError(null);
    setSubmitting(true);
    try {
      const request: AddCommentRequest = { taskId: taskId.trim(), userId: currentUserId, commentText: commentText.trim() };
      await addComment(request);
      setCommentText("");
      await loadComments();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al agregar comentario");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-slate-700">Comentarios por tarea</h3>
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
        <div className="flex gap-4 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="commentProject" className="block text-sm font-medium text-slate-700">Proyecto</label>
            <select
              id="commentProject"
              value={projectId}
              onChange={(e) => { setProjectId(e.target.value); setTaskId(""); }}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Todos los proyectos</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="commentTaskId" className="block text-sm font-medium text-slate-700">Tarea</label>
            <select
              id="commentTaskId"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Selecciona una tarea</option>
              {filteredTasks.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={loadComments}
            disabled={!taskId.trim() || loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Cargar comentarios"}
          </button>
        </div>
        <form onSubmit={handleAddComment} className="mt-4 flex gap-2 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="commentText" className="block text-sm font-medium text-slate-700">Comentario</label>
            <textarea
              id="commentText"
              rows={2}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              placeholder="Escribe un comentario..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !taskId.trim() || !commentText.trim()}
            className="rounded-lg bg-primary-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-primary-700 disabled:opacity-50"
          >
            {submitting ? "..." : "Agregar comentario"}
          </button>
        </form>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-slate-700">Lista de comentarios</h3>
        {comments.length === 0 ? (
          <p className="text-slate-500">Ingresa un ID de tarea y pulsa Cargar comentarios.</p>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c.id} className="border-l-4 border-primary-200 pl-3 py-1 text-sm">
                <span className="text-slate-500 text-xs">{new Date(c.createdAt).toLocaleString()}</span>
                <p className="text-slate-800">{c.commentText}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
