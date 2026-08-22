using System.ComponentModel.DataAnnotations;

namespace StudentAPI.Models
{
    public class Course
    {
        [Key]
        public int CourseID { get; set; }

        [Required]
        public string CourseCode { get; set; } = "";

        [Required]
        public string CourseName { get; set; } = "";

        [Range(1, 10)]
        public int Credits { get; set; }

        // Navigation property: one course can have many enrollments
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }
}