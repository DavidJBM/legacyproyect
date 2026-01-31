namespace TaskManager.Infrastructure.Persistence;

/// <summary>
/// Configuración de conexión a MongoDB (reemplaza localStorage del legacy).
/// </summary>
public class MongoDbSettings
{
    public const string SectionName = "MongoDb";

    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
}
