"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    MessageSquare,
    History,
    Bell,
    Search,
    PieChart,
    LogOut,
    ChevronLeft,
    ChevronRight,
    User
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type TabId = "tasks" | "projects" | "comments" | "history" | "notifications" | "search" | "reports" | "kanban";

interface SidebarProps {
    activeTab: TabId;
    onTabChange: (id: TabId) => void;
    username: string;
}

const menuItems = [
    { id: "kanban", label: "Tablero Kanban", icon: FolderKanban },
    { id: "tasks", label: "Lista de Tareas", icon: CheckSquare },
    { id: "projects", label: "Proyectos", icon: LayoutDashboard },
    { id: "comments", label: "Comentarios", icon: MessageSquare },
    { id: "history", label: "Historial", icon: History },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    { id: "search", label: "Búsqueda", icon: Search },
    { id: "reports", label: "Reportes", icon: PieChart },
];

export function Sidebar({ activeTab, onTabChange, username }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? "80px" : "260px" }}
            className="sidebar-glass h-screen sticky top-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
        >
            {/* Header / Logo */}
            <div className="p-6 flex items-center justify-between">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                                <CheckSquare className="text-white w-6 h-6" />
                            </div>
                            <span className="font-bold text-white text-xl tracking-tight">TaskFlow</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* User Info */}
            <div className={cn("px-4 mb-8", isCollapsed ? "text-center" : "")}>
                <div className={cn("flex items-center gap-3 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50", isCollapsed ? "justify-center" : "")}>
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-primary-400">
                        <User size={20} />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="text-white font-medium text-sm leading-none mb-1">{username}</span>
                            <span className="text-slate-400 text-xs font-normal">Administrador</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id as TabId)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                            activeTab === item.id
                                ? "bg-primary-600/10 text-primary-400 border border-primary-500/20"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        )}
                    >
                        <item.icon size={22} className={cn("flex-shrink-0 transition-transform group-hover:scale-110", activeTab === item.id ? "text-primary-400" : "")} />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="font-medium text-sm whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </AnimatePresence>

                        {activeTab === item.id && (
                            <motion.div
                                layoutId="active-indicator"
                                className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                            />
                        )}
                    </button>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-800/50">
                <button
                    onClick={handleLogout}
                    className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200",
                        isCollapsed ? "justify-center" : ""
                    )}
                >
                    <LogOut size={22} />
                    {!isCollapsed && <span className="font-medium text-sm">Cerrar Sesión</span>}
                </button>
            </div>
        </motion.aside>
    );
}
