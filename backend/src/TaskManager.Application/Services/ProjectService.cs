using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;

namespace TaskManager.Application.Services;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _repository;

    public ProjectService(IProjectRepository repository) => _repository = repository;

    public async Task<IReadOnlyList<ProjectDto>> GetProjectsAsync(CancellationToken cancellationToken = default)
    {
        var list = await _repository.GetAllAsync(cancellationToken);
        return list.Select(Map).ToList();
    }

    public async Task<ProjectDto?> GetProjectByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var p = await _repository.GetByIdAsync(id, cancellationToken);
        return p is null ? null : Map(p);
    }

    public async Task<ProjectDto> AddProjectAsync(CreateProjectRequest request, CancellationToken cancellationToken = default)
    {
        var project = new Project
        {
            Id = Guid.NewGuid().ToString("N"),
            Name = request.Name,
            Description = request.Description ?? string.Empty
        };
        var added = await _repository.AddAsync(project, cancellationToken);
        return Map(added);
    }

    public async Task<bool> UpdateProjectAsync(string id, CreateProjectRequest request, CancellationToken cancellationToken = default)
    {
        var existing = await _repository.GetByIdAsync(id, cancellationToken);
        if (existing is null) return false;
        var updated = new Project { Id = existing.Id, Name = request.Name, Description = request.Description ?? string.Empty };
        return await _repository.UpdateAsync(id, updated, cancellationToken);
    }

    public async Task<bool> DeleteProjectAsync(string id, CancellationToken cancellationToken = default)
        => await _repository.DeleteAsync(id, cancellationToken);

    private static ProjectDto Map(Project p) => new() { Id = p.Id, Name = p.Name, Description = p.Description };
}
