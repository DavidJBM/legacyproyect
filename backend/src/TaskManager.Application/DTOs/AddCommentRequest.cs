namespace TaskManager.Application.DTOs;

public class AddCommentRequest
{
    public string TaskId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string CommentText { get; set; } = string.Empty;
}
