"use client";

import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskItem } from "@/types/task";
import { ProjectItem } from "@/types/project";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { motion } from "framer-motion";

interface KanbanColumnProps {
    id: string;
    title: string;
    tasks: TaskItem[];
    projects: ProjectItem[];
    color: string;
    onDeleteTask?: (id: string) => void;
    onEditTask?: (task: TaskItem) => void;
}

export function KanbanColumn({ id, title, tasks, projects, color, onDeleteTask, onEditTask }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({
        id,
    });

    return (
        <div className="flex flex-col w-80 min-w-[320px] h-full gap-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="font-bold text-slate-700 uppercase tracking-wider text-xs flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${id === 'Nueva' ? 'bg-slate-400' : id === 'En Progreso' ? 'bg-primary-500' : 'bg-emerald-500'}`} />
                    {title}
                    <span className="ml-1 bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {tasks.length}
                    </span>
                </h3>
            </div>

            <div
                ref={setNodeRef}
                className="flex-1 bg-slate-100/50 rounded-2xl p-4 border-2 border-dashed border-slate-200/60 overflow-y-auto custom-scrollbar transition-colors duration-200"
            >
                <SortableContext id={id} items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <KanbanTaskCard
                                key={task.id}
                                task={task}
                                projects={projects}
                                onDelete={onDeleteTask}
                                onEdit={onEditTask}
                            />
                        ))}
                        {tasks.length === 0 && (
                            <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-300 text-sm font-medium">
                                Suelta aquí
                            </div>
                        )}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
}
