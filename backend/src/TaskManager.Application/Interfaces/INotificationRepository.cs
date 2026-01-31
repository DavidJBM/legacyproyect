using TaskManager.Domain.Entities;

namespace TaskManager.Application.Interfaces;

public interface INotificationRepository
{
    Task<IReadOnlyList<Notification>> GetByUserIdAsync(string userId, bool unreadOnly, CancellationToken cancellationToken = default);
    Task<Notification> AddAsync(Notification notification, CancellationToken cancellationToken = default);
    Task MarkAllReadForUserAsync(string userId, CancellationToken cancellationToken = default);
}
