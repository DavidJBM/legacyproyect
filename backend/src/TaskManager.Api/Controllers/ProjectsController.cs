using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;

namespace TaskManager.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _service;

    public ProjectsController(IProjectService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProjectDto>>> GetProjects(CancellationToken cancellationToken)
    {
        var list = await _service.GetProjectsAsync(cancellationToken);
        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProjectDto>> GetProject(string id, CancellationToken cancellationToken)
    {
        var p = await _service.GetProjectByIdAsync(id, cancellationToken);
        if (p is null) return NotFound();
        return Ok(p);
    }

    [HttpPost]
    public async Task<ActionResult<ProjectDto>> AddProject([FromBody] CreateProjectRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name)) return BadRequest("El nombre es requerido.");
        var project = await _service.AddProjectAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateProject(string id, [FromBody] CreateProjectRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name)) return BadRequest("El nombre es requerido.");
        var ok = await _service.UpdateProjectAsync(id, request, cancellationToken);
        if (!ok) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProject(string id, CancellationToken cancellationToken)
    {
        var ok = await _service.DeleteProjectAsync(id, cancellationToken);
        if (!ok) return NotFound();
        return NoContent();
    }
}
