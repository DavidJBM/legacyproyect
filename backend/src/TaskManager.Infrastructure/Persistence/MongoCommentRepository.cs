using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Persistence;

namespace TaskManager.Infrastructure.Persistence;

public class MongoCommentRepository : ICommentRepository
{
    private readonly IMongoCollection<Comment> _collection;

    public MongoCommentRepository(IOptions<MongoDbSettings> options)
    {
        var settings = options.Value;
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.DatabaseName);
        _collection = database.GetCollection<Comment>("comments");
    }

    public async Task<IReadOnlyList<Comment>> GetByTaskIdAsync(string taskId, CancellationToken cancellationToken = default)
        => await _collection.Find(c => c.TaskId == taskId).SortBy(c => c.CreatedAt).ToListAsync(cancellationToken);

    public async Task<Comment> AddAsync(Comment comment, CancellationToken cancellationToken = default)
    {
        await _collection.InsertOneAsync(comment, cancellationToken: cancellationToken);
        return comment;
    }
}
