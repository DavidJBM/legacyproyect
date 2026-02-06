"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, CheckSquare, ArrowRight } from "lucide-react";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
        const body = isLogin
            ? { username, password }
            : { username, email, password };

        try {
            const response = await fetch(endpoint.replace("/api/auth", "/api/backend/Auth"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || (typeof data === 'string' ? data : "Ocurrió un error"));
            }

            if (isLogin) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("userId", data.userId);
                router.push("/dashboard");
            } else {
                setIsLogin(true);
                setError("Registro exitoso. Por favor inicia sesión.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex bg-white font-sans">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 to-secondary-600/30 z-0" />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-500/20 blur-[120px] rounded-full" />

                <div className="relative z-10 text-center p-12 max-w-lg">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
                    >
                        <CheckSquare className="text-white w-10 h-10" />
                    </motion.div>
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-bold text-white mb-6 tracking-tight"
                    >
                        Gestiona tus proyectos con elegancia.
                    </motion.h2>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-slate-400 text-lg leading-relaxed"
                    >
                        La plataforma moderna diseñada para equipos que buscan simplicidad y potencia en una sola interfaz.
                    </motion.p>
                </div>

                {/* Decorative floating elements */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 right-1/4 w-32 h-32 glass-card opacity-20 rotate-12"
                />
                <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 left-1/4 w-24 h-24 glass-card opacity-10 -rotate-12"
                />
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50/50">
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10 lg:hidden flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                            <CheckSquare className="text-white w-6 h-6" />
                        </div>
                        <span className="font-bold text-2xl text-slate-900">TaskFlow</span>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            {isLogin ? "¡Hola de nuevo!" : "Únete a TaskFlow"}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {isLogin ? "Ingresa tus credenciales para continuar." : "Completa el formulario para empezar hoy."}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className={clsx(
                                    "mb-6 p-4 rounded-2xl text-sm font-medium border flex items-center gap-3",
                                    error.includes("exitoso")
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                        : "bg-rose-50 text-rose-700 border-rose-100"
                                )}
                            >
                                <div className={clsx("w-2 h-2 rounded-full", error.includes("exitoso") ? "bg-emerald-500" : "bg-rose-500")} />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Nombre de Usuario</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="input-modern pl-16"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="ej. bustillos"
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="space-y-1.5 transition-all">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Corporativo</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="input-modern pl-16"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="correo@empresa.com"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="input-modern pl-16"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 text-base mt-4"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Procesando...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isLogin ? "Entrar al Panel" : "Crear mi Cuenta"}
                                    <ArrowRight size={18} />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            {isLogin ? "¿Nuevo en la plataforma?" : "¿Ya eres miembro?"}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 text-primary-600 hover:text-primary-700 font-bold hover:underline transition-all"
                            >
                                {isLogin ? "Crea una cuenta gratis" : "Inicia sesión aquí"}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
