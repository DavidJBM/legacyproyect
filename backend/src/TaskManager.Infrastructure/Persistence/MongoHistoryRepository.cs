using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Persistence;

namespace TaskManager.Infrastructure.Persistence;

public class MongoHistoryRepository : IHistoryRepository
{
    private readonly IMongoCollection<HistoryEntry> _collection;

    public MongoHistoryRepository(IOptions<MongoDbSettings> options)
    {
        var settings = options.Value;
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);
        _collection = database.GetCollection<HistoryEntry>("history");
    }

    public async Task<IReadOnlyList<HistoryEntry>> GetByTaskIdAsync(string taskId, CancellationToken cancellationToken = default)
        => await _collection.Find(h => h.TaskId == taskId).SortByDescending(h => h.Timestamp).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<HistoryEntry>> GetAllAsync(int limit, CancellationToken cancellationToken = default)
        => await _collection.Find(_ => true).SortByDescending(h => h.Timestamp).Limit(limit).ToListAsync(cancellationToken);

    public async Task<HistoryEntry> AddAsync(HistoryEntry entry, CancellationToken cancellationToken = default)
    {
        await _collection.InsertOneAsync(entry, cancellationToken: cancellationToken);
        return entry;
    }
}
