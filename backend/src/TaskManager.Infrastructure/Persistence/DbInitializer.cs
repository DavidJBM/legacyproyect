using System;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using BC = BCrypt.Net.BCrypt;

namespace TaskManager.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedDataAsync(
        IUserRepository userRepository,
        IProjectRepository projectRepository,
        ITaskRepository taskRepository)
    {
        // 1. Seed User if none exists
        var users = await userRepository.GetAllAsync();
        if (users.Count == 0)
        {
            var admin = new User
            {
                Username = "admin",
                Email = "admin@taskmanager.com",
                PasswordHash = BC.HashPassword("admin123")
            };
            await userRepository.AddAsync(admin);
            
            // 2. Seed Projects
            var project1 = new Project
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "Migración a Stack Moderno",
                Description = "Proyecto para migrar de Vanilla JS a Next.js y .NET"
            };
            await projectRepository.AddAsync(project1);

            var project2 = new Project
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = "E-Commerce App",
                Description = "Desarrollo de una tienda en línea con microservicios"
            };
            await projectRepository.AddAsync(project2);

            // 3. Seed Tasks
            await taskRepository.AddAsync(new TaskItem
            {
                Id = Guid.NewGuid().ToString("N"),
                Title = "Configurar MongoDB Atlas",
                Description = "Establecer conexión y crear colecciones",
                Status = "Completada",
                Priority = "Alta",
                ProjectId = project1.Id,
                CreatedByUserId = admin.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            await taskRepository.AddAsync(new TaskItem
            {
                Id = Guid.NewGuid().ToString("N"),
                Title = "Implementar Registro de Usuarios",
                Description = "Crear endpoints y componentes de frontend",
                Status = "En Progreso",
                Priority = "Media",
                ProjectId = project1.Id,
                CreatedByUserId = admin.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }
    }
}
