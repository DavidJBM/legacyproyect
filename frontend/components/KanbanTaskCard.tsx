"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskItem } from "@/types/task";
import { Calendar, MoreHorizontal, User, Trash2, Edit2 } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface KanbanTaskCardProps {
    task: TaskItem;
    isDragging?: boolean;
    onDelete?: (id: string) => void;
    onEdit?: (task: TaskItem) => void;
}

export function KanbanTaskCard({ task, isDragging, onDelete, onEdit }: KanbanTaskCardProps) {
    const [showMenu, setShowMenu] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
    };

    const priorityColor = {
        Baja: "bg-blue-100 text-blue-700",
        Media: "bg-amber-100 text-amber-700",
        Alta: "bg-rose-100 text-rose-700",
    }[task.priority as "Baja" | "Media" | "Alta"] || "bg-slate-100 text-slate-700";

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("¿Estás seguro de eliminar esta tarea?")) {
            onDelete?.(task.id);
        }
        setShowMenu(false);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Implementar lógica de edición futura o modal
        alert("Función de edición rápida próximamente");
        setShowMenu(false);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={clsx(
                "group glass-card p-4 cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-primary-500/20 transition-all relative",
                isDragging || isSortableDragging ? "opacity-40" : "opacity-100"
            )}
            onMouseLeave={() => setShowMenu(false)}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider", priorityColor)}>
                    {task.priority || "Media"}
                </span>
                <div className="relative">
                    <button
                        onPointerDown={(e) => {
                            e.stopPropagation(); // Prevent drag start
                            setShowMenu(!showMenu);
                        }}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
                    >
                        <MoreHorizontal size={16} />
                    </button>

                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                            >
                                <button
                                    onClick={handleEdit}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                >
                                    <Edit2 size={14} /> Editar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                >
                                    <Trash2 size={14} /> Eliminar
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <h4 className="text-sm font-semibold text-slate-800 mb-1 line-clamp-2 leading-tight">
                {task.title}
            </h4>
            <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-snug">
                {task.description}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 font-medium">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                    <Calendar size={12} />
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Sin fecha"}
                </div>

                <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-500 overflow-hidden">
                        <User size={12} />
                    </div>
                </div>
            </div>
        </div>
    );
}
