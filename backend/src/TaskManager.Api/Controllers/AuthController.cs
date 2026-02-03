using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TaskManager.Application.Interfaces;
using TaskManager.Domain.Entities;
using BC = BCrypt.Net.BCrypt;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthController(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto model)
    {
        if (await _userRepository.GetByUsernameAsync(model.Username) != null)
            return BadRequest("El nombre de usuario ya existe.");

        if (await _userRepository.GetByEmailAsync(model.Email) != null)
            return BadRequest("El correo electrónico ya está registrado.");

        var user = new User
        {
            Username = model.Username,
            Email = model.Email,
            PasswordHash = BC.HashPassword(model.Password)
        };

        await _userRepository.AddAsync(user);

        return Ok(new { message = "Registro exitoso" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        Console.WriteLine($"[LOGIN DEBUG] Starting login for user: {model.Username}");
        try 
        {
            var user = await _userRepository.GetByUsernameAsync(model.Username);
            
            if (user == null)
            {
                Console.WriteLine($"[LOGIN DEBUG] User not found: {model.Username}");
                return Unauthorized("Usuario o contraseña incorrectos.");
            }

            Console.WriteLine($"[LOGIN DEBUG] User found. Verifying password...");
            if (!BC.Verify(model.Password, user.PasswordHash))
            {
                Console.WriteLine($"[LOGIN DEBUG] Password verification failed for: {model.Username}");
                return Unauthorized("Usuario o contraseña incorrectos.");
            }

            Console.WriteLine($"[LOGIN DEBUG] Password verified. Generating token...");
            var token = GenerateJwtToken(user);

            Console.WriteLine($"[LOGIN DEBUG] Token generated successfully for: {model.Username}");
            return Ok(new 
            { 
                token, 
                username = user.Username, 
                userId = user.Id 
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[LOGIN DEBUG] EXCEPTION during login: {ex.Message}");
            Console.WriteLine($"[LOGIN DEBUG] STACK TRACE: {ex.StackTrace}");
            throw; // Re-throw to be caught by global exception handler
        }
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? "fallback_secret_key_for_dev_only_1234567890";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddHours(8),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class RegisterDto
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
