using System.ComponentModel.DataAnnotations;
using StudentAPI.Models;

namespace StudentAPI.DTOs
{
    public class RegisterDto
    {
        [Required, MinLength(3), MaxLength(100)]
        public string Username { get; set; } = "";

        [Required, MinLength(6)]
        public string Password { get; set; } = "";

        // Defaults to Teacher; only an existing Admin can create another Admin
        // (enforced in the controller, not trusted from client input).
        public string Role { get; set; } = Roles.Teacher;
    }

    public class LoginDto
    {
        [Required]
        public string Username { get; set; } = "";

        [Required]
        public string Password { get; set; } = "";
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = "";
        public string Username { get; set; } = "";
        public string Role { get; set; } = "";
        public DateTime ExpiresAt { get; set; }
    }
}
