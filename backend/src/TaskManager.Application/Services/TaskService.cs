using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;

    public TaskService(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<IReadOnlyList<TaskDto>> GetTasksAsync(CancellationToken cancellationToken = default)
    {
        var tasks = await _taskRepository.GetAllAsync(cancellationToken);
        return tasks.Select(MapToDto).ToList();
    }

    public async Task<IReadOnlyList<TaskDto>> SearchTasksAsync(string? searchText, string? status, string? priority, string? projectId, CancellationToken cancellationToken = default)
    {
        var tasks = await _taskRepository.GetAllAsync(cancellationToken);
        var query = tasks.AsEnumerable();
        if (!string.IsNullOrWhiteSpace(searchText))
        {
            var s = searchText.Trim().ToLowerInvariant();
            query = query.Where(t => (t.Title?.ToLowerInvariant().Contains(s) ?? false) || (t.Description?.ToLowerInvariant().Contains(s) ?? false));
        }
        if (!string.IsNullOrWhiteSpace(status)) query = query.Where(t => t.Status == status);
        if (!string.IsNullOrWhiteSpace(priority)) query = query.Where(t => t.Priority == priority);
        if (!string.IsNullOrWhiteSpace(projectId)) query = query.Where(t => t.ProjectId == projectId);
        return query.Select(MapToDto).ToList();
    }

    public async Task<TaskDto?> GetTaskByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var task = await _taskRepository.GetByIdAsync(id, cancellationToken);
        return task is null ? null : MapToDto(task);
    }

    public async Task<TaskDto> AddTaskAsync(CreateTaskRequest request, CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var task = new TaskItem
        {
            Id = Guid.NewGuid().ToString("N"),
            Title = request.Title,
            Description = request.Description ?? string.Empty,
            Status = request.Status ?? "Pendiente",
            Priority = request.Priority ?? "Media",
            ProjectId = request.ProjectId,
            AssignedToUserId = request.AssignedToUserId,
            DueDate = request.DueDate,
            EstimatedHours = request.EstimatedHours,
            ActualHours = 0,
            CreatedByUserId = request.CreatedByUserId,
            CreatedAt = now,
            UpdatedAt = now
        };
        var added = await _taskRepository.AddAsync(task, cancellationToken);
        return MapToDto(added);
    }

    public async Task<bool> UpdateTaskAsync(string id, CreateTaskRequest request, CancellationToken cancellationToken = default)
    {
        var existing = await _taskRepository.GetByIdAsync(id, cancellationToken);
        if (existing is null) return false;

        var updated = new TaskItem
        {
            Id = existing.Id,
            Title = request.Title,
            Description = request.Description ?? string.Empty,
            Status = request.Status ?? "Pendiente",
            Priority = request.Priority ?? "Media",
            ProjectId = request.ProjectId,
            AssignedToUserId = request.AssignedToUserId,
            DueDate = request.DueDate,
            EstimatedHours = request.EstimatedHours,
            ActualHours = existing.ActualHours,
            CreatedByUserId = existing.CreatedByUserId,
            CreatedAt = existing.CreatedAt,
            UpdatedAt = DateTime.UtcNow
        };
        return await _taskRepository.UpdateAsync(id, updated, cancellationToken);
    }

    public async Task<bool> DeleteTaskAsync(string id, CancellationToken cancellationToken = default)
    {
        return await _taskRepository.DeleteAsync(id, cancellationToken);
    }

    private static TaskDto MapToDto(TaskItem task)
    {
        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            ProjectId = task.ProjectId,
            AssignedToUserId = task.AssignedToUserId,
            DueDate = task.DueDate,
            EstimatedHours = task.EstimatedHours,
            ActualHours = task.ActualHours,
            CreatedByUserId = task.CreatedByUserId,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt
        };
    }
}
