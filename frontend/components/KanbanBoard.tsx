"use client";

import { useState, useEffect } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { TaskItem, CreateTaskRequest } from "@/types/task";
import { updateTask, deleteTask } from "@/lib/api";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanTaskCard } from "./KanbanTaskCard";
import type { ProjectItem } from "@/types/project";

interface KanbanBoardProps {
    tasks: TaskItem[];
    projects: ProjectItem[];
    onRefresh: () => void;
    onEditTask?: (task: TaskItem) => void;
}

export type ColumnId = "Nueva" | "En Progreso" | "Completada";

const COLUMNS: { id: ColumnId; title: string; color: string }[] = [
    { id: "Nueva", title: "Pendientes", color: "bg-slate-200" },
    { id: "En Progreso", title: "En Curso", color: "bg-primary-100" },
    { id: "Completada", title: "Finalizado", color: "bg-emerald-100" },
];

export function KanbanBoard({ tasks, projects, onRefresh, onEditTask }: KanbanBoardProps) {
    // Only update local state when tasks change from prop (server sync)
    // AND allow local optimistic updates without flickering
    const [items, setItems] = useState<Record<ColumnId, TaskItem[]>>({
        Nueva: [],
        "En Progreso": [],
        Completada: [],
    });
    const [activeTask, setActiveTask] = useState<TaskItem | null>(null);

    useEffect(() => {
        const newItems: Record<ColumnId, TaskItem[]> = {
            Nueva: tasks.filter((t) => t.status === "Nueva" || !t.status),
            "En Progreso": tasks.filter((t) => t.status === "En Progreso"),
            Completada: tasks.filter((t) => t.status === "Completada"),
        };
        setItems(newItems);
    }, [tasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks.find((t) => t.id === active.id);
        if (task) setActiveTask(task);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeContainer = findContainer(activeId);
        const overContainer = overId in items ? (overId as ColumnId) : findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) return;

        setItems((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];

            const activeIndex = activeItems.findIndex((item) => item.id === activeId);
            const overIndex = overId in items ? overItems.length : overItems.findIndex((item) => item.id === overId);

            let newIndex: number;
            if (overId in items) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowLastItem = over && activeIndex > overIndex;
                const modifier = isBelowLastItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            // Optimistic update of local state
            return {
                ...prev,
                [activeContainer]: [...prev[activeContainer].filter((item) => item.id !== active.id)],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    items[activeContainer][activeIndex],
                    ...prev[overContainer].slice(newIndex, prev[overContainer].length),
                ],
            };
        });
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        const activeId = active.id as string;

        if (!over) {
            setActiveTask(null);
            return;
        }

        const overId = over.id as string;
        const activeContainer = findContainer(activeId);
        const overContainer = overId in items ? (overId as ColumnId) : findContainer(overId);

        if (!activeContainer || !overContainer) {
            setActiveTask(null);
            return;
        }

        setActiveTask(null);

        // Movement within same container
        if (activeContainer === overContainer) {
            const activeIndex = items[activeContainer].findIndex((i) => i.id === activeId);
            const overIndex = items[overContainer].findIndex((i) => i.id === overId);

            if (activeIndex !== overIndex) {
                setItems((prev) => ({
                    ...prev,
                    [overContainer]: arrayMove(prev[overContainer], activeIndex, overIndex),
                }));
            }
        } else {
            // Movement between containers (Update Status)
            // Note: We already updated the UI optimistically in DragOver, but we need to ensure the backend syncs.
            const task = tasks.find((t) => t.id === activeId);
            if (task) {
                try {
                    // Update backend
                    const request: CreateTaskRequest = {
                        title: task.title,
                        description: task.description,
                        status: overContainer, // New status
                        priority: task.priority,
                        projectId: task.projectId,
                        assignedToUserId: task.assignedToUserId
                    };
                    await updateTask(task.id, request);

                    // CRITICAL: Call onRefresh so the PARENT component updates its count!
                    // The parent 'tasks' state is what drives the header counters.
                    onRefresh();
                } catch (err) {
                    console.error("Error updating task status", err);
                    // Revert UI if needed (by re-fetching original state via onRefresh)
                    onRefresh();
                }
            }
        }
    };

    const findContainer = (id: string): ColumnId | null => {
        if (id in items) return id as ColumnId;
        return (Object.keys(items) as ColumnId[]).find((key) =>
            items[key].find((item) => item.id === id)
        ) || null;
    };

    const handleDeleteTask = async (id: string) => {
        try {
            await deleteTask(id);
            onRefresh();
        } catch (err) {
            console.error("Failed to delete task", err);
            alert("Error al eliminar la tarea");
        }
    };

    return (
        <div className="flex gap-6 h-[calc(100vh-12rem)] pb-4 overflow-x-auto min-w-full">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {COLUMNS.map((col) => (
                    <KanbanColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        tasks={items[col.id]}
                        projects={projects}
                        color={col.color}
                        onDeleteTask={handleDeleteTask}
                        onEditTask={onEditTask}
                    />
                ))}

                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: "0.5",
                            },
                        },
                    }),
                }}>
                    {activeTask ? (
                        <KanbanTaskCard task={activeTask} projects={projects} isDragging />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
