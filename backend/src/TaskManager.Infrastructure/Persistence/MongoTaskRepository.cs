using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Persistence;

namespace TaskManager.Infrastructure.Persistence;

public class MongoTaskRepository : ITaskRepository
{
    private readonly IMongoCollection<TaskItem> _collection;

    public MongoTaskRepository(IOptions<MongoDbSettings> options)
    {
        var settings = options.Value;
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);
        _collection = database.GetCollection<TaskItem>("tasks");

        // Crear índices para búsquedas frecuentes
        var projectIdIndex = new CreateIndexModel<TaskItem>(Builders<TaskItem>.IndexKeys.Ascending(t => t.ProjectId));
        var assignedToIndex = new CreateIndexModel<TaskItem>(Builders<TaskItem>.IndexKeys.Ascending(t => t.AssignedToUserId));
        _collection.Indexes.CreateMany(new[] { projectIdIndex, assignedToIndex });
    }

    public async Task<IReadOnlyList<TaskItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _collection.Find(_ => true).ToListAsync(cancellationToken);
    }

    public async Task<TaskItem?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return await _collection.Find(t => t.Id == id).FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<TaskItem> AddAsync(TaskItem task, CancellationToken cancellationToken = default)
    {
        await _collection.InsertOneAsync(task, cancellationToken: cancellationToken);
        return task;
    }

    public async Task<bool> UpdateAsync(string id, TaskItem task, CancellationToken cancellationToken = default)
    {
        var result = await _collection.ReplaceOneAsync(
            t => t.Id == id,
            task,
            cancellationToken: cancellationToken);
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        var result = await _collection.DeleteOneAsync(t => t.Id == id, cancellationToken);
        return result.IsAcknowledged && result.DeletedCount > 0;
    }
}
