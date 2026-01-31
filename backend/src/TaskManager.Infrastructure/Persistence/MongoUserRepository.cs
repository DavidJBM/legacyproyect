using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;

namespace TaskManager.Infrastructure.Persistence;

public class MongoUserRepository : IUserRepository
{
    private readonly IMongoCollection<User> _collection;

    public MongoUserRepository(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _collection = database.GetCollection<User>("Users");

        // Crear índices únicos para Username y Email
        var options = new CreateIndexOptions { Unique = true };
        var usernameIndex = new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(u => u.Username), options);
        var emailIndex = new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(u => u.Email), options);
        _collection.Indexes.CreateMany(new[] { usernameIndex, emailIndex });
    }

    public async Task<User?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return await _collection.Find(u => u.Id == id).FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default)
    {
        return await _collection.Find(u => u.Username == username).FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _collection.Find(u => u.Email == email).FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<User>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _collection.Find(_ => true).ToListAsync(cancellationToken);
    }

    public async Task<User> AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _collection.InsertOneAsync(user, cancellationToken: cancellationToken);
        return user;
    }
}
