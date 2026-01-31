using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.Interfaces;
using System.Text;

namespace TaskManager.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly ITaskService _taskService;
    private readonly IProjectService _projectService;

    public ReportsController(ITaskService taskService, IProjectService projectService)
    {
        _taskService = taskService;
        _projectService = projectService;
    }

    /// <summary>Reporte por estado de tareas (equivalente a generateReport('tasks') en app.js).</summary>
    [HttpGet("tasks")]
    public async Task<ActionResult<Dictionary<string, int>>> ReportTasks(CancellationToken cancellationToken)
    {
        var tasks = await _taskService.GetTasksAsync(cancellationToken);
        var statusCount = new Dictionary<string, int>();
        foreach (var t in tasks)
        {
            var status = string.IsNullOrEmpty(t.Status) ? "Pendiente" : t.Status;
            statusCount[status] = statusCount.GetValueOrDefault(status) + 1;
        }
        return Ok(statusCount);
    }

    /// <summary>Reporte de tareas por proyecto (equivalente a generateReport('projects') en app.js).</summary>
    [HttpGet("projects")]
    public async Task<ActionResult<IReadOnlyList<object>>> ReportProjects(CancellationToken cancellationToken)
    {
        var projects = await _projectService.GetProjectsAsync(cancellationToken);
        var tasks = await _taskService.GetTasksAsync(cancellationToken);
        var result = projects.Select(p => new { projectName = p.Name, taskCount = tasks.Count(t => t.ProjectId == p.Id) }).ToList<object>();
        return Ok(result);
    }

    /// <summary>Reporte de tareas asignadas por usuario (equivalente a generateReport('users') en app.js).</summary>
    [HttpGet("users")]
    public async Task<ActionResult<IReadOnlyList<object>>> ReportUsers(CancellationToken cancellationToken)
    {
        var tasks = await _taskService.GetTasksAsync(cancellationToken);
        var byUser = tasks.Where(t => !string.IsNullOrEmpty(t.AssignedToUserId)).GroupBy(t => t.AssignedToUserId!);
        var result = byUser.Select(g => new { userId = g.Key, taskCount = g.Count() }).ToList<object>();
        return Ok(result);
    }

    /// <summary>Exportar tareas a CSV (equivalente a exportCSV() en app.js).</summary>
    [HttpGet("export/csv")]
    public async Task<IActionResult> ExportCsv(CancellationToken cancellationToken)
    {
        var tasks = await _taskService.GetTasksAsync(cancellationToken);
        var projects = await _projectService.GetProjectsAsync(cancellationToken);
        var sb = new StringBuilder();
        sb.AppendLine("ID,Título,Estado,Prioridad,Proyecto");
        foreach (var t in tasks)
        {
            var projectName = projects.FirstOrDefault(p => p.Id == t.ProjectId)?.Name ?? "Sin proyecto";
            sb.AppendLine($"{t.Id},\"{EscapeCsv(t.Title)}\",\"{EscapeCsv(t.Status ?? "Pendiente")}\",\"{EscapeCsv(t.Priority ?? "Media")}\",\"{EscapeCsv(projectName)}\"");
        }
        var bytes = Encoding.UTF8.GetBytes(sb.ToString());
        return File(bytes, "text/csv", "export_tasks.csv");
    }

    private static string EscapeCsv(string value) => value.Replace("\"", "\"\"");
}
