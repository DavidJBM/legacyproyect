namespace TaskManager.Domain.Entities;

/// <summary>
/// Entidad Proyecto (equivalente al objeto project del legacy app.js / localStorage "projects").
/// </summary>
public class Project
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
