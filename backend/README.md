# Task Manager API — Backend .NET (Clean Architecture)

API REST que reemplaza la lógica de `app.js` (Storage, addTask, getTasks, etc.) con un backend en .NET y MongoDB.

## Stack

- **.NET 8** (compatible con .NET 10 cuando esté disponible; actualiza `TargetFramework` en los `.csproj`).
- **Clean Architecture:** Domain → Application → Infrastructure → API.
- **MongoDB:** persistencia (reemplaza localStorage).

## Estructura

```
backend/src/
├── TaskManager.Domain/          # Entidades: User, Project, TaskItem
├── TaskManager.Application/     # DTOs, interfaces (ITaskService, ITaskRepository), TaskService
├── TaskManager.Infrastructure/  # MongoTaskRepository, MongoDbSettings
└── TaskManager.Api/             # TasksController, Program.cs, appsettings
```

## Requisitos

- .NET 8 SDK (o superior).
- MongoDB en ejecución (local o remoto).

## Ejecución

1. Asegúrate de que MongoDB esté corriendo (`mongodb://localhost:27017` o ajusta `appsettings.json`).
2. Desde la raíz del backend:

```bash
cd src/TaskManager.Api
dotnet run
```

La API quedará en `http://localhost:5000`. Swagger: `http://localhost:5000/swagger`.

## Endpoints (equivalencia con app.js)

| Método | Ruta | Equivalente Legacy |
|--------|------|--------------------|
| GET | /api/tasks | `Storage.getTasks()` + `loadTasks()` |
| GET | /api/tasks/{id} | Selección de tarea por ID |
| POST | /api/tasks | `addTask()` |
| PUT | /api/tasks/{id} | `updateTask()` |
| DELETE | /api/tasks/{id} | `deleteTask()` |

## Testabilidad

- `ITaskRepository` y `ITaskService` permiten inyectar fakes en tests unitarios.
- En tests: registrar una implementación en memoria de `ITaskRepository` y ejercitar `TaskService` sin MongoDB.
