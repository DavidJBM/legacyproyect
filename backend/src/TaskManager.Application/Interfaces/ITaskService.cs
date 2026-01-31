using TaskManager.Application.DTOs;

namespace TaskManager.Application.Interfaces;

/// <summary>
/// Servicio de aplicación para tareas (casos de uso).
/// Equivalente conceptual a addTask / getTasks del legacy app.js, pero desacoplado de UI y persistencia.
/// </summary>
public interface ITaskService
{
    Task<IReadOnlyList<TaskDto>> GetTasksAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<TaskDto>> SearchTasksAsync(string? searchText, string? status, string? priority, string? projectId, CancellationToken cancellationToken = default);
    Task<TaskDto?> GetTaskByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<TaskDto> AddTaskAsync(CreateTaskRequest request, CancellationToken cancellationToken = default);
    Task<bool> UpdateTaskAsync(string id, CreateTaskRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteTaskAsync(string id, CancellationToken cancellationToken = default);
}
