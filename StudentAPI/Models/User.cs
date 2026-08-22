using System.ComponentModel.DataAnnotations;

namespace StudentAPI.Models
{
    public static class Roles
    {
        public const string Admin = "Admin";
        public const string Teacher = "Teacher";
    }

    public class User
    {
        [Key]
        public int UserID { get; set; }

        [Required]
        public string Username { get; set; } = "";

        [Required]
        public string PasswordHash { get; set; } = "";

        [Required]
        public string Role { get; set; } = Roles.Teacher;
    }
}