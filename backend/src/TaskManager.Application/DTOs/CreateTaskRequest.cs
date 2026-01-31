namespace TaskManager.Application.DTOs;

/// <summary>
/// Request para crear tarea (equivalente al payload de addTask() en app.js).
/// </summary>
public class CreateTaskRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Pendiente";
    public string Priority { get; set; } = "Media";
    public string? ProjectId { get; set; }
    public string? AssignedToUserId { get; set; }
    public string? DueDate { get; set; }
    public decimal EstimatedHours { get; set; }
    public string? CreatedByUserId { get; set; }
}
