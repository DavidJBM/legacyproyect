namespace TaskManager.Domain.Entities;

/// <summary>
/// Entidad Usuario (equivalente al objeto user del legacy app.js / localStorage "users").
/// </summary>
public class User
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
}
