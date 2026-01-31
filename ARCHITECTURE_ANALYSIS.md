# Análisis Arquitectónico: Migración Legacy → Stack Moderno

**Proyecto:** Task Manager — De SPA Monolítica (Vanilla JS + LocalStorage) a Arquitectura Distribuida (.NET 10 + Next.js + MongoDB)

---

## 1. Resumen del Sistema Legacy

El sistema original es una **Single Page Application monolítica** compuesta por:

| Elemento | Implementación Legacy |
|----------|------------------------|
| **Frontend** | Un único `index.html` (277 líneas) con todo el markup |
| **Lógica** | Un único `app.js` (842 líneas) con Storage, UI, negocio y DOM |
| **Estilos** | `style.css` (193 líneas), diseño "antiguo" con Courier New y bordes sólidos |
| **Persistencia** | `localStorage` del navegador (claves: `users`, `projects`, `tasks`, etc.) |

**Problemas arquitectónicos identificados:**

- **Acoplamiento fuerte:** La misma función lee del DOM, valida, persiste en localStorage y actualiza la UI.
- **Sin separación de responsabilidades:** Storage, autenticación, CRUD y renderizado comparten el mismo archivo.
- **Estado global implícito:** `currentUser` y `selectedTaskId` son variables globales accesibles desde cualquier parte.
- **Imposibilidad de testear** la lógica sin ejecutar el navegador y simular DOM/localStorage.

---

## 2. Características Arquitectónicas: Comparativa Explícita

### 2.1 Mantenibilidad

#### Código Legacy (app.js)

- **Un solo archivo de 842 líneas** que concentra:
  - Objeto `Storage` (init, getUsers, getProjects, getTasks, addTask, updateTask, deleteTask, etc.).
  - Funciones de UI: `login()`, `logout()`, `showTab()`, `loadTasks()`, `loadProjects()`, `selectTask()`, `updateStats()`.
  - Funciones de negocio/CRUD: `addTask()`, `updateTask()`, `deleteTask()`, `addProject()`, etc.
  - Funciones de comentarios, historial, notificaciones, búsqueda y reportes.

**Ejemplo concreto — Cambiar la forma de crear una tarea:**

En el legacy, hay que tocar `addTask()` (líneas 266-309), que:

1. Lee valores de `document.getElementById('taskTitle')`, `document.getElementById('taskDescription')`, etc.
2. Construye el objeto `task`.
3. Llama a `Storage.addTask(task)`.
4. Escribe en historial y notificaciones.
5. Llama a `loadTasks()`, `clearTaskForm()`, `updateStats()` y `alert()`.

Cualquier cambio (nuevo campo, validación distinta, otro flujo) obliga a modificar esta función gigante y arriesgar efectos secundarios en el resto del archivo.

#### Nuevo Stack

- **Backend (.NET 10 + Clean Architecture):**
  - **TaskController:** solo recibe HTTP, delega en servicios. Cambios en la API se limitan al controlador o a DTOs.
  - **Servicios (Application):** lógica de negocio aislada (por ejemplo, `ITaskService` / `TaskService`). Se puede cambiar la regla de creación de tareas sin tocar el controlador ni la base de datos.
  - **Repositorios (Infrastructure):** acceso a MongoDB encapsulado. Cambiar de MongoDB a otro almacenamiento solo afecta a esta capa.

- **Frontend (Next.js + TypeScript):**
  - **Componentes separados:** por ejemplo, `TaskCreateForm.tsx` (formulario) y `TaskList.tsx` (lista). Cambiar el formulario no requiere tocar la lista.
  - **Páginas por ruta:** `app/dashboard/page.tsx` solo orquesta componentes y datos. La lógica de negocio está en el backend.

**Conclusión (Mantenibilidad):** Pasar de un `app.js` gigante a **controladores + servicios + repositorios** en .NET y a **componentes y páginas** en Next.js reduce el impacto de cada cambio, facilita la localización de bugs y permite que varios desarrolladores trabajen en paralelo sin pisotearse en el mismo archivo.

---

### 2.2 Escalabilidad

#### Legacy: LocalStorage

- **Límite de almacenamiento:** según la especificación, típicamente **5–10 MB** por origen (dominio). No es configurable por aplicación.
- **Sin concurrencia:** solo el navegador del usuario escribe/lee; no hay servidor que centralice datos para múltiples usuarios o dispositivos.
- **Sin índices ni consultas complejas:** cada "consulta" es `JSON.parse(localStorage.getItem('tasks'))` y filtrar en memoria. Con miles de tareas, el rendimiento se degrada en el cliente.
- **Datos atados al dispositivo:** otro usuario o otro navegador no ven los mismos datos; no hay escalabilidad horizontal ni multi-usuario real.

**Código legacy representativo:**

```javascript
// app.js - líneas 78-80
getTasks() {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
}
```

Toda la colección se carga siempre; no hay paginación ni proyecciones a nivel de almacenamiento.

#### Nuevo Stack: MongoDB

- **Escalabilidad de datos:** MongoDB escala horizontalmente (sharding) y puede almacenar grandes volúmenes sin el techo rígido de 5–10 MB.
- **Consultas y índices:** se pueden definir índices por `status`, `projectId`, `dueDate`, etc., y hacer consultas paginadas o por criterios sin cargar todo en memoria.
- **Multi-usuario y centralización:** un solo backend sirve a muchos clientes (Next.js, móvil, etc.); los datos son consistentes para todos.
- **Recursos del servidor:** la carga de procesamiento y almacenamiento se desplaza al servidor, que puede escalarse (más réplicas, más nodos) independientemente del cliente.

**Conclusión (Escalabilidad):** Sustituir LocalStorage por **MongoDB** elimina el límite fijo de tamaño, permite consultas eficientes e índices, y habilita un modelo multi-usuario y multi-dispositivo escalable.

---

### 2.3 Testabilidad

#### Legacy: Sin Inyección de Dependencias

- **Storage acoplado a localStorage:** no hay interfaz ni abstracción. Para testear "addTask" habría que:
  - Ejecutar tests en un entorno con `localStorage` (por ejemplo, jsdom).
  - Limpiar y rellenar `localStorage` antes/después de cada test.
  - Mockear `document.getElementById`, `alert`, etc., porque la misma función hace UI y persistencia.

**Ejemplo — addTask() en app.js (266-309):**

```javascript
function addTask() {
    // ...
    const task = { title: document.getElementById('taskTitle').value, ... };
    const taskId = Storage.addTask(task);
    Storage.addHistory({ ... });
    if (task.assignedTo > 0) Storage.addNotification({ ... });
    loadTasks();
    clearTaskForm();
    updateStats();
    alert('Tarea agregada');
}
```

No se puede testear solo la lógica de "crear tarea y registrar historial" sin invocar DOM, `Storage` real y `alert`. No hay forma de inyectar un "fake" de Storage ni de UI.

- **Estado global:** `currentUser` y `selectedTaskId` hacen que el orden y el estado de los tests importen; los tests no son aislados ni repetibles sin cuidado extremo.

#### Nuevo Stack: Inyección de Dependencias en .NET

- **Interfaces en la capa Application:** por ejemplo, `ITaskRepository` y `IHistoryService`. El caso de uso "CreateTask" depende de abstracciones, no de MongoDB ni de archivos directamente.
- **Tests unitarios:** en los tests se inyectan **fakes** o **mocks** (por ejemplo, `FakeTaskRepository` que devuelve una lista en memoria). Se prueba solo la lógica del servicio: "dado un DTO válido, se llama a Repository.Add una vez y se devuelve el id".
- **Tests de integración:** opcionalmente se prueba el `TaskController` con una base en memoria o un MongoDB de test, sin tocar el frontend.

**Ejemplo conceptual en el nuevo backend:**

```csharp
// El servicio recibe ITaskRepository por constructor (DI).
// En producción: implementación MongoDB.
// En tests: implementación en memoria que no toca ningún almacenamiento real.
public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;
    public TaskService(ITaskRepository taskRepository) => _taskRepository = taskRepository;
    public async Task<TaskDto> CreateAsync(CreateTaskRequest request) { ... }
}
```

**Conclusión (Testabilidad):** La **inyección de dependencias** en .NET permite tests unitarios rápidos y deterministas de la lógica de negocio, algo que en el código actual es **prácticamente imposible** sin refactorizar por completo el monolito.

---

### 2.4 Modularidad

#### Legacy: Frontend y "Backend" en el Mismo Lugar

- **Todo en el cliente:** HTML, CSS, JavaScript y "persistencia" (localStorage) viven en el mismo proyecto; no hay servicio HTTP ni API.
- **Sin capas:** no existe distinción clara entre "presentación", "aplicación" y "persistencia". Un mismo archivo mezcla:
  - Acceso a datos (`Storage.getTasks()`).
  - Reglas de negocio (validaciones, historial, notificaciones).
  - Manipulación del DOM (`tbody.innerHTML = ''`, `document.getElementById(...).value`).
- **Reutilización nula:** no hay API que pueda ser consumida por otra app (móvil, otra web, integraciones).

**Estructura legacy:**

```
legacyproyect/
├── index.html   # UI + estructura de todas las pantallas
├── app.js       # Storage + Auth + CRUD + UI + Reportes (todo junto)
├── style.css    # Estilos
└── README.md
```

#### Nuevo Stack: Frontend y Backend Separados

- **Backend (API .NET 10):**
  - Expone contratos HTTP (REST): `GET /api/tasks`, `POST /api/tasks`, etc.
  - Clean Architecture: Domain → Application (casos de uso) → Infrastructure (MongoDB) → API (controladores).
  - Cualquier cliente que hable HTTP puede consumir la misma API.

- **Frontend (Next.js):**
  - Solo se preocupa de la UI y de llamar a la API (fetch o cliente HTTP). No conoce MongoDB ni la estructura interna del backend.
  - Puede desplegarse en un dominio/CDN y el backend en otro, escalando y desplegando de forma independiente.

**Estructura objetivo:**

```
legacyproyect/
├── backend/                    # .NET 10 Web API
│   ├── src/
│   │   ├── TaskManager.Domain/
│   │   ├── TaskManager.Application/
│   │   ├── TaskManager.Infrastructure/
│   │   └── TaskManager.Api/
│   └── ...
├── frontend/                   # Next.js (App Router)
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── TaskList.tsx
│   │   └── TaskCreateForm.tsx
│   └── ...
└── ARCHITECTURE_ANALYSIS.md    # Este documento
```

**Conclusión (Modularidad):** La separación **Frontend (Next.js) vs Backend (.NET API)** permite desarrollar, desplegar y escalar cada parte por separado, reutilizar la API en otros clientes y respetar una arquitectura por capas (presentación, aplicación, persistencia) en lugar de un monolito en un solo archivo.

---

## 3. Tabla Resumen de Características

| Característica   | Legacy (app.js + index.html + LocalStorage)     | Nuevo Stack (.NET 10 + Next.js + MongoDB)                    |
|------------------|-------------------------------------------------|--------------------------------------------------------------|
| **Mantenibilidad** | Un archivo enorme; cambios de alto riesgo     | Componentes y capas acotadas; cambios localizados            |
| **Escalabilidad**  | Límite 5–10 MB; sin multi-usuario real        | MongoDB escalable; multi-usuario; consultas e índices        |
| **Testabilidad**   | Sin DI; tests requieren DOM y localStorage    | DI en .NET; tests unitarios e integración factibles          |
| **Modularidad**    | Monolito en el navegador; sin API             | Frontend/Backend separados; API reutilizable                 |

---

## 4. Referencias al Código Legacy

Para la presentación o entrega, se puede señalar:

- **Mantenibilidad:** comparar la longitud y responsabilidades de `app.js` (842 líneas) con la división en `TaskController`, `TaskService`, `TaskList.tsx` y `TaskCreateForm.tsx`.
- **Escalabilidad:** mostrar `Storage.getTasks()` (app.js, ~78-80) frente a un endpoint `GET /api/tasks` con paginación y repositorio MongoDB.
- **Testabilidad:** mostrar que `addTask()` (app.js, 266-309) usa DOM y `Storage` directos, frente a un `TaskService` con `ITaskRepository` inyectado.
- **Modularidad:** mostrar la estructura de carpetas legacy (3–4 archivos) frente a la estructura `backend/` y `frontend/` con múltiples proyectos y componentes.

Este documento sirve como base para explicar en la entrega académica cómo la migración mejora cada una de estas **características arquitectónicas** de forma concreta y verificable en el código.
