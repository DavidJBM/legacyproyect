using TaskManager.Domain.Entities;

namespace TaskManager.Application.Interfaces;

public interface IHistoryRepository
{
    Task<IReadOnlyList<HistoryEntry>> GetByTaskIdAsync(string taskId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<HistoryEntry>> GetAllAsync(int limit, CancellationToken cancellationToken = default);
    Task<HistoryEntry> AddAsync(HistoryEntry entry, CancellationToken cancellationToken = default);
}
