using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TaskManager.Application.Interfaces;
using TaskManager.Application.Services;
using TaskManager.Infrastructure;
using TaskManager.Infrastructure.Persistence;

// Carga manual de .env buscando hacia arriba desde el directorio de ejecución
string? currentSearchPath = Directory.GetCurrentDirectory();
string? envPath = null;
while (currentSearchPath != null)
{
    var testPath = Path.Combine(currentSearchPath, ".env");
    if (File.Exists(testPath))
    {
        envPath = testPath;
        break;
    }
    currentSearchPath = Directory.GetParent(currentSearchPath)?.FullName;
}

Console.WriteLine($"Directorio actual: {Directory.GetCurrentDirectory()}");
if (envPath != null)
{
    Console.WriteLine($".env encontrado en: {envPath}. Cargando variables...");
    foreach (var line in File.ReadAllLines(envPath))
    {
        if (string.IsNullOrWhiteSpace(line) || line.Trim().StartsWith("#")) continue;
        var parts = line.Split('=', 2);
        if (parts.Length == 2) Environment.SetEnvironmentVariable(parts[0].Trim(), parts[1].Trim());
    }
}
else
{
    Console.WriteLine("ADVERTENCIA: No se encontró el archivo .env en ninguna carpeta superior!");
}

Console.WriteLine($"DB_CONN: {(!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING")) ? "CONFIGURADO" : "NULO")}");
Console.WriteLine($"DB_NAME: {Environment.GetEnvironmentVariable("MONGODB_DATABASE_NAME")}");

var builder = WebApplication.CreateBuilder(args);

// Mapeo manual de variables de entorno a la configuración
builder.Configuration["MongoDb:ConnectionString"] = Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING") 
    ?? builder.Configuration["MongoDb:ConnectionString"];
builder.Configuration["MongoDb:DatabaseName"] = Environment.GetEnvironmentVariable("MONGODB_DATABASE_NAME") 
    ?? builder.Configuration["MongoDb:DatabaseName"];

// API Controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Application services
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IHistoryService, HistoryService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// Infrastructure
builder.Services.AddInfrastructure(builder.Configuration);

// Auth JWT
var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? "fallback_secret_key_for_dev_only_1234567890";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000/",
        "https://frontend-mkiz.onrender.com/")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var userRepository = services.GetRequiredService<IUserRepository>();
    var projectRepository = services.GetRequiredService<IProjectRepository>();
    var taskRepository = services.GetRequiredService<ITaskRepository>();
    try 
    {
        Console.WriteLine("Iniciando SeedDataAsync...");
        await DbInitializer.SeedDataAsync(userRepository, projectRepository, taskRepository);
        Console.WriteLine("SeedDataAsync finalizado.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"ERROR en Seed: {ex.Message}");
    }
}

// Enable Swagger in all environments for testing
app.UseSwagger();
app.UseSwaggerUI();


app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
