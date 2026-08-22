using System.ComponentModel.DataAnnotations;

namespace StudentAPI.Models
{
    public class Student
    {
        [Key]
        public int StudentID { get; set; }

        [Required]
        public string Name { get; set; } = "";

        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";

        public long ContactNumber { get; set; }

        [Range(1, 120)]
        public int Age { get; set; }

        public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;

        // Navigation property: one student can have many course enrollments
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }
}