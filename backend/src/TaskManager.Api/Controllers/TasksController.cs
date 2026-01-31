using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;

namespace TaskManager.Api.Controllers;

/// <summary>
/// Controlador que reemplaza las funciones addTask y getTasks del legacy app.js.
/// Expone la API REST para el frontend Next.js.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    /// <summary>
    /// GET /api/tasks — Equivalente a Storage.getTasks() + loadTasks() en app.js.
    /// GET /api/tasks?search=&status=&priority=&projectId= — Búsqueda (equivalente a searchTasks() en app.js).
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<TaskDto>>> GetTasks(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] string? priority,
        [FromQuery] string? projectId,
        CancellationToken cancellationToken)
    {
        if (!string.IsNullOrEmpty(search) || !string.IsNullOrEmpty(status) || !string.IsNullOrEmpty(priority) || !string.IsNullOrEmpty(projectId))
        {
            var results = await _taskService.SearchTasksAsync(search, status, priority, projectId, cancellationToken);
            return Ok(results);
        }
        var tasks = await _taskService.GetTasksAsync(cancellationToken);
        return Ok(tasks);
    }

    /// <summary>
    /// GET /api/tasks/{id} — Obtener una tarea por ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTask(string id, CancellationToken cancellationToken)
    {
        var task = await _taskService.GetTaskByIdAsync(id, cancellationToken);
        if (task is null) return NotFound();
        return Ok(task);
    }

    /// <summary>
    /// POST /api/tasks — Equivalente a addTask() en app.js.
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TaskDto>> AddTask([FromBody] CreateTaskRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest("El título es requerido.");

        var task = await _taskService.AddTaskAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
    }

    /// <summary>
    /// PUT /api/tasks/{id} — Equivalente a updateTask() en app.js.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateTask(string id, [FromBody] CreateTaskRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest("El título es requerido.");

        var updated = await _taskService.UpdateTaskAsync(id, request, cancellationToken);
        if (!updated) return NotFound();
        return NoContent();
    }

    /// <summary>
    /// DELETE /api/tasks/{id} — Equivalente a deleteTask() en app.js.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTask(string id, CancellationToken cancellationToken)
    {
        var deleted = await _taskService.DeleteTaskAsync(id, cancellationToken);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
