# Use the official .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy the solution and all project files to restore dependencies
COPY TaskManager.sln ./
COPY src/TaskManager.Api/TaskManager.Api.csproj src/TaskManager.Api/
COPY src/TaskManager.Application/TaskManager.Application.csproj src/TaskManager.Application/
COPY src/TaskManager.Domain/TaskManager.Domain.csproj src/TaskManager.Domain/
COPY src/TaskManager.Infrastructure/TaskManager.Infrastructure.csproj src/TaskManager.Infrastructure/

# Restore dependencies
RUN dotnet restore

# Copy the rest of the source code
COPY src/ src/

# Build and publish the API project
WORKDIR /app/src/TaskManager.Api
RUN dotnet publish -c Release -o /app/out

# Use the ASP.NET runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# Expose the port the app runs on (Railway uses the PORT env var)
EXPOSE 80
EXPOSE 443

# Entry point for the application
ENTRYPOINT ["dotnet", "TaskManager.Api.dll"]
