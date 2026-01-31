"use client";

import { useState, useEffect } from "react";
import { getCommentsByTaskId, addComment } from "@/lib/api";
import type { CommentItem, AddCommentRequest } from "@/types/comment";

interface CommentsSectionProps {
  currentUserId: string;
}

export function CommentsSection({ currentUserId }: CommentsSectionProps) {
  const [taskId, setTaskId] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          <div>
            <label htmlFor="commentTaskId" className="block text-sm font-medium text-slate-700">ID Tarea</label>
            <input
              id="commentTaskId"
              type="text"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              placeholder="ID de la tarea"
              className="mt-1 block w-40 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
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
