# Task Manager - Project Evolution

Este repositorio contiene la evolución de un sistema de gestión de tareas, desde una implementación simple monolítica hasta una arquitectura moderna distribuida y escalable.

---

## 🏗️ Arquitectura del Proyecto

El proyecto se divide en dos etapas principales:

### 1. Sistema Legacy (Vanilla JS)
Una **Single Page Application (SPA)** minimalista diseñada para funcionar sin dependencias externas ni servidor.
- **Ubicación:** Raíz del proyecto.
- **Frontend:** HTML5, CSS3 y JavaScript puro.
- **Persistencia:** `localStorage` del navegador.
- **Uso:** Abrir `index.html` directamente en el navegador.

### 2. Sistema Moderno (Full Stack)
Una transición hacia una arquitectura profesional y escalable siguiendo principios de **Clean Architecture**.

#### 🖥️ Frontend (Next.js)
Ubicado en la carpeta [`frontend`](./frontend).
- **Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS.
- **Interactividad:** Kanban board avanzado con Drag & Drop (`@dnd-kit`), animaciones con Framer Motion y componentes responsivos.
- **Ejecución:**
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

#### ⚙️ Backend (.NET 10)
Ubicado en la carpeta [`backend`](./backend).
- **Stack:** .NET 10 Web API.
- **Arquitectura:** Clean Architecture (Domain, Application, Infrastructure, API).
- **Persistencia:** Integración con MongoDB.
- **Ejecución:**
  ```bash
  cd backend
  dotnet restore
  dotnet run --project src/TaskManager.Api
  ```

---

## 📂 Estructura de Directorios

```
legacyproyect/
├── backend/            # API en .NET 10 (Clean Architecture)
├── frontend/           # Aplicación Next.js 14 + TS + Tailwind
├── MongoTest/          # Scripts de prueba para base de datos
├── ARCHITECTURE_ANALYSIS.md # Análisis detallado de la migración
├── index.html          # Punto de entrada versión Legacy
├── app.js              # Lógica versión Legacy
├── style.css           # Estilos versión Legacy
└── README.md           # Este archivo
```

---

## 🚀 Características Principales

- **Gestión de Tareas:** CRUD completo con estados, prioridades y asignaciones.
- **Tablero Kanban:** Interfaz interactiva de arrastrar y soltar para flujo de trabajo.
- **Proyectos:** Organización de tareas por proyectos específicos.
- **Personalización:** Soporte para temas (Dark Mode) y diseño premium.
- **Seguridad:** Transición de login básico a autenticación robusta gestionada por el backend.

---

## 📄 Documentación Adicional

Para un análisis técnico profundo sobre las decisiones arquitectónicas y la comparativa entre el sistema legacy y el moderno, consulta:
👉 [ARCHITECTURE_ANALYSIS.md](./ARCHITECTURE_ANALYSIS.md)
