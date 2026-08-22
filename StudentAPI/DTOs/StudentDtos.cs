using System.ComponentModel.DataAnnotations;

namespace StudentAPI.DTOs
{
    public class StudentReadDto
    {
        public int StudentID { get; set; }
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public long ContactNumber { get; set; }
        public int Age { get; set; }
        public DateTime EnrollmentDate { get; set; }
    }

    public class StudentCreateDto
    {
        [Required, MaxLength(250)]
        public string Name { get; set; } = "";

        [Required, EmailAddress]
        public string Email { get; set; } = "";

        [Required]
        public long ContactNumber { get; set; }

        [Range(1, 120)]
        public int Age { get; set; }
    }

    public class StudentUpdateDto
    {
        [Required, MaxLength(250)]
        public string Name { get; set; } = "";

        [Required, EmailAddress]
        public string Email { get; set; } = "";

        [Required]
        public long ContactNumber { get; set; }

        [Range(1, 120)]
        public int Age { get; set; }
    }

    // Wraps a page of results with metadata so the frontend can render
    // pagination controls without a second round-trip.
    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    }
}
