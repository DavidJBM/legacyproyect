using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;

namespace TaskManager.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _service;

    public NotificationsController(INotificationService service) => _service = service;

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IReadOnlyList<NotificationDto>>> GetByUserId(string userId, [FromQuery] bool unreadOnly = true, CancellationToken cancellationToken = default)
    {
        var list = await _service.GetByUserIdAsync(userId, unreadOnly, cancellationToken);
        return Ok(list);
    }

    [HttpPost("user/{userId}/mark-read")]
    public async Task<ActionResult> MarkAllRead(string userId, CancellationToken cancellationToken)
    {
        await _service.MarkAllReadAsync(userId, cancellationToken);
        return NoContent();
    }
}
