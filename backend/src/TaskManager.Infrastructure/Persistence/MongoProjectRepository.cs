using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Persistence;

namespace TaskManager.Infrastructure.Persistence;

public class MongoProjectRepository : IProjectRepository
{
    private readonly IMongoCollection<Project> _collection;

    public MongoProjectRepository(IOptions<MongoDbSettings> options)
    {
        var settings = options.Value;
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);
        _collection = database.GetCollection<Project>("projects");

        // Crear índice para el nombre
        var nameIndex = new CreateIndexModel<Project>(Builders<Project>.IndexKeys.Ascending(p => p.Name));
        _collection.Indexes.CreateOne(nameIndex);
    }

    public async Task<IReadOnlyList<Project>> GetAllAsync(CancellationToken cancellationToken = default)
        => await _collection.Find(_ => true).ToListAsync(cancellationToken);

    public async Task<Project?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
        => await _collection.Find(p => p.Id == id).FirstOrDefaultAsync(cancellationToken);

    public async Task<Project> AddAsync(Project project, CancellationToken cancellationToken = default)
    {
        await _collection.InsertOneAsync(project, cancellationToken: cancellationToken);
        return project;
    }

    public async Task<bool> UpdateAsync(string id, Project project, CancellationToken cancellationToken = default)
    {
        var result = await _collection.ReplaceOneAsync(p => p.Id == id, project, cancellationToken: cancellationToken);
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        var result = await _collection.DeleteOneAsync(p => p.Id == id, cancellationToken);
        return result.IsAcknowledged && result.DeletedCount > 0;
    }
}
