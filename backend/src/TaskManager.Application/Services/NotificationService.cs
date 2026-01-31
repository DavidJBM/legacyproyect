using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _repository;

    public NotificationService(INotificationRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<NotificationDto>> GetByUserIdAsync(string userId, bool unreadOnly = true, CancellationToken cancellationToken = default)
    {
        var list = await _repository.GetByUserIdAsync(userId, unreadOnly, cancellationToken);
        return list.Select(Map).ToList();
    }

    public async Task MarkAllReadAsync(string userId, CancellationToken cancellationToken = default)
        => await _repository.MarkAllReadForUserAsync(userId, cancellationToken);

    private static NotificationDto Map(Notification n) => new()
    {
        Id = n.Id, UserId = n.UserId, Message = n.Message, Type = n.Type, Read = n.Read, CreatedAt = n.CreatedAt
    };
}
