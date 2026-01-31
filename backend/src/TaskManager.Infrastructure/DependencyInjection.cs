using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TaskManager.Application.Interfaces;
using TaskManager.Infrastructure.Persistence;

namespace TaskManager.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<MongoDbSettings>(
            configuration.GetSection(MongoDbSettings.SectionName));
        services.AddSingleton<ITaskRepository, MongoTaskRepository>();
        services.AddSingleton<IProjectRepository, MongoProjectRepository>();
        services.AddSingleton<ICommentRepository, MongoCommentRepository>();
        services.AddSingleton<IHistoryRepository, MongoHistoryRepository>();
        services.AddSingleton<INotificationRepository, MongoNotificationRepository>();
        return services;
    }
}
