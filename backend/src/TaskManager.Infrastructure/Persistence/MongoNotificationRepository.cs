using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Persistence;

namespace TaskManager.Infrastructure.Persistence;

public class MongoNotificationRepository : INotificationRepository
{
    private readonly IMongoCollection<Notification> _collection;

    public MongoNotificationRepository(IOptions<MongoDbSettings> options)
    {
        var settings = options.Value;
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);
        _collection = database.GetCollection<Notification>("notifications");
    }

    public async Task<IReadOnlyList<Notification>> GetByUserIdAsync(string userId, bool unreadOnly, CancellationToken cancellationToken = default)
    {
        var filter = Builders<Notification>.Filter.Eq(n => n.UserId, userId);
        if (unreadOnly)
            filter &= Builders<Notification>.Filter.Eq(n => n.Read, false);
        return await _collection.Find(filter).SortByDescending(n => n.CreatedAt).ToListAsync(cancellationToken);
    }

    public async Task<Notification> AddAsync(Notification notification, CancellationToken cancellationToken = default)
    {
        await _collection.InsertOneAsync(notification, cancellationToken: cancellationToken);
        return notification;
    }

    public async Task MarkAllReadForUserAsync(string userId, CancellationToken cancellationToken = default)
    {
        var filter = Builders<Notification>.Filter.Eq(n => n.UserId, userId);
        var update = Builders<Notification>.Update.Set(n => n.Read, true);
        await _collection.UpdateManyAsync(filter, update, cancellationToken: cancellationToken);
    }
}
