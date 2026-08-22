using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentAPI.Models
{
    public class Enrollment
    {
        [Key]
        public int EnrollmentID { get; set; }

        [Required]
        public int StudentID { get; set; }

        [ForeignKey(nameof(StudentID))]
        public Student? Student { get; set; }

        [Required]
        public int CourseID { get; set; }

        [ForeignKey(nameof(CourseID))]
        public Course? Course { get; set; }

        public DateTime EnrolledOn { get; set; } = DateTime.UtcNow;

        // Nullable: grade is assigned later, not at enrollment time
        public string? Grade { get; set; }
    }
}