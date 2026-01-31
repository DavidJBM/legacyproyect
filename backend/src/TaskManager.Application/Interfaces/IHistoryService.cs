using TaskManager.Application.DTOs;

namespace TaskManager.Application.Interfaces;

public interface IHistoryService
{
    Task<IReadOnlyList<HistoryEntryDto>> GetByTaskIdAsync(string taskId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<HistoryEntryDto>> GetAllAsync(int limit = 100, CancellationToken cancellationToken = default);
    Task AddEntryAsync(string taskId, string userId, string action, string? oldValue, string? newValue, CancellationToken cancellationToken = default);
}
