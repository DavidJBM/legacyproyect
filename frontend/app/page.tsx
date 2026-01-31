import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        Task Manager — Stack Moderno
      </h1>
      <p className="text-slate-600 mb-8 max-w-md text-center">
        Migración desde Vanilla JS + LocalStorage a Next.js + .NET API + MongoDB.
      </p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-primary-600 px-6 py-3 text-white font-medium shadow-sm hover:bg-primary-700 transition"
      >
        Ir al Dashboard
      </Link>
    </main>
  );
}
