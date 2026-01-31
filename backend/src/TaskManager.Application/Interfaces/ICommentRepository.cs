using TaskManager.Domain.Entities;

namespace TaskManager.Application.Interfaces;

public interface ICommentRepository
{
    Task<IReadOnlyList<Comment>> GetByTaskIdAsync(string taskId, CancellationToken cancellationToken = default);
    Task<Comment> AddAsync(Comment comment, CancellationToken cancellationToken = default);
}
