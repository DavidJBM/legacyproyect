using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Services;

public class HistoryService : IHistoryService
{
    private readonly IHistoryRepository _repository;

    public HistoryService(IHistoryRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<HistoryEntryDto>> GetByTaskIdAsync(string taskId, CancellationToken cancellationToken = default)
    {
        var list = await _repository.GetByTaskIdAsync(taskId, cancellationToken);
        return list.Select(Map).ToList();
    }

    public async Task<IReadOnlyList<HistoryEntryDto>> GetAllAsync(int limit = 100, CancellationToken cancellationToken = default)
    {
        var list = await _repository.GetAllAsync(limit, cancellationToken);
        return list.Select(Map).ToList();
    }

    public async Task AddEntryAsync(string taskId, string userId, string action, string? oldValue, string? newValue, CancellationToken cancellationToken = default)
    {
        var entry = new HistoryEntry
        {
            Id = Guid.NewGuid().ToString("N"),
            TaskId = taskId,
            UserId = userId,
            Action = action,
            OldValue = oldValue,
            NewValue = newValue,
            Timestamp = DateTime.UtcNow
        };
        await _repository.AddAsync(entry, cancellationToken);
    }

    private static HistoryEntryDto Map(HistoryEntry e) => new()
    {
        Id = e.Id, TaskId = e.TaskId, UserId = e.UserId, Action = e.Action,
        OldValue = e.OldValue, NewValue = e.NewValue, Timestamp = e.Timestamp
    };
}
