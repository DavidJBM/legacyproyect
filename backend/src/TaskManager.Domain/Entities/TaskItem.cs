namespace TaskManager.Domain.Entities;

/// <summary>
/// Entidad Tarea (equivalente al objeto task del legacy app.js / localStorage "tasks").
/// Nombrada TaskItem para evitar conflicto con System.Threading.Tasks.Task.
/// </summary>
public class TaskItem
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Pendiente";
    public string Priority { get; set; } = "Media";
    public string? ProjectId { get; set; }
    public string? AssignedToUserId { get; set; }
    public string? DueDate { get; set; }
    public decimal EstimatedHours { get; set; }
    public decimal ActualHours { get; set; }
    public string? CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
