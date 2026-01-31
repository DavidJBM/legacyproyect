using TaskManager.Application.DTOs;

namespace TaskManager.Application.Interfaces;

public interface ICommentService
{
    Task<IReadOnlyList<CommentDto>> GetByTaskIdAsync(string taskId, CancellationToken cancellationToken = default);
    Task<CommentDto> AddCommentAsync(AddCommentRequest request, CancellationToken cancellationToken = default);
}
