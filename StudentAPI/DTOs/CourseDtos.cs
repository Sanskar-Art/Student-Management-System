using System.ComponentModel.DataAnnotations;

namespace StudentAPI.DTOs
{
    public class CourseReadDto
    {
        public int CourseID { get; set; }
        public string CourseCode { get; set; } = "";
        public string CourseName { get; set; } = "";
        public int Credits { get; set; }
    }

    public class CourseCreateDto
    {
        [Required, MaxLength(20)]
        public string CourseCode { get; set; } = "";

        [Required, MaxLength(150)]
        public string CourseName { get; set; } = "";

        [Range(1, 10)]
        public int Credits { get; set; }
    }

    public class EnrollmentCreateDto
    {
        [Required]
        public int StudentID { get; set; }

        [Required]
        public int CourseID { get; set; }
    }

    public class EnrollmentReadDto
    {
        public int EnrollmentID { get; set; }
        public int StudentID { get; set; }
        public string StudentName { get; set; } = "";
        public int CourseID { get; set; }
        public string CourseName { get; set; } = "";
        public DateTime EnrolledOn { get; set; }
        public string? Grade { get; set; }
    }

    public class GradeUpdateDto
    {
        [Required, MaxLength(2)]
        public string Grade { get; set; } = "";
    }
}
