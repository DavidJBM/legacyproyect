using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Services;

public class CommentService : ICommentService
{
    private readonly ICommentRepository _repository;

    public CommentService(ICommentRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<CommentDto>> GetByTaskIdAsync(string taskId, CancellationToken cancellationToken = default)
    {
        var list = await _repository.GetByTaskIdAsync(taskId, cancellationToken);
        return list.Select(Map).ToList();
    }

    public async Task<CommentDto> AddCommentAsync(AddCommentRequest request, CancellationToken cancellationToken = default)
    {
        var comment = new Comment
        {
            Id = Guid.NewGuid().ToString("N"),
            TaskId = request.TaskId,
            UserId = request.UserId,
            CommentText = request.CommentText,
            CreatedAt = DateTime.UtcNow
        };
        var added = await _repository.AddAsync(comment, cancellationToken);
        return Map(added);
    }

    private static CommentDto Map(Comment c) => new()
    {
        Id = c.Id, TaskId = c.TaskId, UserId = c.UserId, CommentText = c.CommentText, CreatedAt = c.CreatedAt
    };
}
