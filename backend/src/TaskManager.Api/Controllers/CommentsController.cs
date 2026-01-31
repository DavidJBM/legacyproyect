using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _service;

    public CommentsController(ICommentService service) => _service = service;

    [HttpGet("task/{taskId}")]
    public async Task<ActionResult<IReadOnlyList<CommentDto>>> GetByTaskId(string taskId, CancellationToken cancellationToken)
    {
        var list = await _service.GetByTaskIdAsync(taskId, cancellationToken);
        return Ok(list);
    }

    [HttpPost]
    public async Task<ActionResult<CommentDto>> AddComment([FromBody] AddCommentRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.TaskId)) return BadRequest("TaskId es requerido.");
        if (string.IsNullOrWhiteSpace(request.CommentText)) return BadRequest("El comentario no puede estar vacío.");
        var comment = await _service.AddCommentAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetByTaskId), new { taskId = request.TaskId }, comment);
    }
}
