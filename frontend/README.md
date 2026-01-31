# Task Manager — Frontend Next.js (App Router + Tailwind)

Frontend moderno que consume la API .NET y reemplaza la UI del legacy (index.html + app.js).

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (diseño responsivo y moderno)

## Estructura

```
frontend/
├── app/
│   ├── layout.tsx       # Layout raíz
│   ├── page.tsx         # Página de inicio (enlace al Dashboard)
│   ├── dashboard/
│   │   └── page.tsx     # Dashboard con lista de tareas y formulario
│   └── globals.css      # Estilos globales + Tailwind
├── components/
│   ├── TaskList.tsx     # Lista de tareas (equivalente a loadTasks + tabla)
│   └── TaskCreateForm.tsx  # Formulario de creación (equivalente a addTask + form)
├── lib/
│   └── api.ts           # Cliente API (getTasks, createTask, etc.)
├── types/
│   └── task.ts          # Tipos TaskItem, CreateTaskRequest
└── ...
```

## Requisitos

- Node.js 18+
- Backend .NET corriendo en `http://localhost:5000` (o configurar rewrites en `next.config.js`).

## Ejecución

1. Instalar dependencias:

```bash
npm install
```

2. Arrancar el backend en otro terminal (desde `backend/src/TaskManager.Api`: `dotnet run`).

3. Arrancar Next.js:

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) y navegar a **Dashboard** para ver la lista de tareas y el formulario de creación.

## Equivalencia con el Legacy

| Legacy (app.js / index.html)     | Nuevo (Next.js)                    |
|----------------------------------|------------------------------------|
| `loadTasks()` + tabla en HTML     | `TaskList` + `getTasks()` desde API |
| Formulario "Nueva/Editar Tarea"   | `TaskCreateForm`                    |
| `addTask()` → Storage             | `createTask()` → POST /api/tasks    |
| `style.css` (apariencia antigua)  | Tailwind CSS (diseño moderno)       |
