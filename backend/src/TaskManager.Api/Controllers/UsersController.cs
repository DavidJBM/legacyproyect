using Microsoft.AspNetCore.Mvc;

namespace TaskManager.Api.Controllers;

/// <summary>Usuarios para dropdowns (equivalente a Storage.getUsers() en app.js). Lista fija para demo.</summary>
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private static readonly List<UserDto> Users = new()
    {
        new UserDto { Id = "1", Username = "admin" },
        new UserDto { Id = "2", Username = "user1" },
        new UserDto { Id = "3", Username = "user2" }
    };

    [HttpGet]
    public ActionResult<IReadOnlyList<UserDto>> GetUsers() => Ok(Users);
}

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
}
