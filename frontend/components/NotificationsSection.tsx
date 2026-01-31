"use client";

import { useState, useEffect } from "react";
import { getNotificationsByUserId, markNotificationsRead } from "@/lib/api";
import type { NotificationItem } from "@/types/notification";

interface NotificationsSectionProps {
  currentUserId: string;
}

export function NotificationsSection({ currentUserId }: NotificationsSectionProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotificationsByUserId(currentUserId, true);
      setNotifications(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar notificaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [currentUserId]);

  const handleMarkRead = async () => {
    setMarking(true);
    try {
      await markNotificationsRead(currentUserId);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-slate-700">Notificaciones</h3>
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Cargar notificaciones"}
          </button>
          <button
            type="button"
            onClick={handleMarkRead}
            disabled={marking || notifications.length === 0}
            className="rounded-lg bg-primary-600 px-4 py-2 text-white font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {marking ? "..." : "Marcar como leídas"}
          </button>
        </div>
        {notifications.length === 0 ? (
          <p className="text-slate-500">No hay notificaciones nuevas.</p>
        ) : (
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li key={n.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                <span className="text-slate-500 text-xs">[{n.type}] {new Date(n.createdAt).toLocaleString()}</span>
                <p className="text-slate-800 mt-1">{n.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
