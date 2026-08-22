using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAPI.DTOs;
using StudentAPI.Models;
using StudentAPI.Services;

namespace StudentAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly APIDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly PasswordHasher<User> _passwordHasher = new();

        public AuthController(APIDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        // POST: api/auth/register
        // Open endpoint so the very first Admin account can be created.
        // In production, lock this behind [Authorize(Roles = Roles.Admin)]
        // once at least one Admin exists.
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
            {
                return Conflict(new { message = "Username already exists." });
            }

            var requestedRole = dto.Role == Roles.Admin ? Roles.Admin : Roles.Teacher;

            var user = new User
            {
                Username = dto.Username,
                Role = requestedRole
            };
            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var (token, expiresAt) = _tokenService.CreateToken(user);
            return Ok(new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Role = user.Role,
                ExpiresAt = expiresAt
            });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == dto.Username);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            var (token, expiresAt) = _tokenService.CreateToken(user);
            return Ok(new AuthResponseDto
            {
                Token = token,
                Username = user.Username,
                Role = user.Role,
                ExpiresAt = expiresAt
            });
        }

        // GET: api/auth/me
        [Authorize]
        [HttpGet("me")]
        public ActionResult Me()
        {
            return Ok(new
            {
                username = User.Identity?.Name,
                role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value
            });
        }
    }
}
