using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;

namespace TaskManager.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class HistoryController : ControllerBase
{
    private readonly IHistoryService _service;

    public HistoryController(IHistoryService service) => _service = service;

    [HttpGet("task/{taskId}")]
    public async Task<ActionResult<IReadOnlyList<HistoryEntryDto>>> GetByTaskId(string taskId, CancellationToken cancellationToken)
    {
        var list = await _service.GetByTaskIdAsync(taskId, cancellationToken);
        return Ok(list);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<HistoryEntryDto>>> GetAll([FromQuery] int limit = 100, CancellationToken cancellationToken = default)
    {
        var list = await _service.GetAllAsync(limit, cancellationToken);
        return Ok(list);
    }
}
