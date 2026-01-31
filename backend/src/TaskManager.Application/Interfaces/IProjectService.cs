using TaskManager.Application.DTOs;

namespace TaskManager.Application.Interfaces;

public interface IProjectService
{
    Task<IReadOnlyList<ProjectDto>> GetProjectsAsync(CancellationToken cancellationToken = default);
    Task<ProjectDto?> GetProjectByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<ProjectDto> AddProjectAsync(CreateProjectRequest request, CancellationToken cancellationToken = default);
    Task<bool> UpdateProjectAsync(string id, CreateProjectRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteProjectAsync(string id, CancellationToken cancellationToken = default);
}
