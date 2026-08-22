using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAPI.DTOs;
using StudentAPI.Models;

namespace StudentAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EnrollmentController : ControllerBase
    {
        private readonly APIDbContext _context;

        public EnrollmentController(APIDbContext context)
        {
            _context = context;
        }

        // GET: api/enrollment/student/5
        // All courses (with grades, if assigned) for a given student.
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<EnrollmentReadDto>>> GetByStudent(int studentId)
        {
            var enrollments = await _context.Enrollments
                .Where(e => e.StudentID == studentId)
                .Include(e => e.Student)
                .Include(e => e.Course)
                .Select(e => ToReadDto(e))
                .ToListAsync();

            return Ok(enrollments);
        }

        // GET: api/enrollment/course/5
        // Roster of students enrolled in a given course.
        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<IEnumerable<EnrollmentReadDto>>> GetByCourse(int courseId)
        {
            var enrollments = await _context.Enrollments
                .Where(e => e.CourseID == courseId)
                .Include(e => e.Student)
                .Include(e => e.Course)
                .Select(e => ToReadDto(e))
                .ToListAsync();

            return Ok(enrollments);
        }

        // POST: api/enrollment
        [Authorize(Roles = Roles.Admin + "," + Roles.Teacher)]
        [HttpPost]
        public async Task<ActionResult<EnrollmentReadDto>> Enroll(EnrollmentCreateDto dto)
        {
            var studentExists = await _context.Students.AnyAsync(s => s.StudentID == dto.StudentID);
            if (!studentExists)
            {
                return NotFound(new { message = $"Student with ID {dto.StudentID} was not found." });
            }

            var courseExists = await _context.Courses.AnyAsync(c => c.CourseID == dto.CourseID);
            if (!courseExists)
            {
                return NotFound(new { message = $"Course with ID {dto.CourseID} was not found." });
            }

            var alreadyEnrolled = await _context.Enrollments.AnyAsync(e =>
                e.StudentID == dto.StudentID && e.CourseID == dto.CourseID);
            if (alreadyEnrolled)
            {
                return Conflict(new { message = "This student is already enrolled in this course." });
            }

            var enrollment = new Enrollment
            {
                StudentID = dto.StudentID,
                CourseID = dto.CourseID,
                EnrolledOn = DateTime.UtcNow
            };

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            await _context.Entry(enrollment).Reference(e => e.Student).LoadAsync();
            await _context.Entry(enrollment).Reference(e => e.Course).LoadAsync();

            return CreatedAtAction(nameof(GetByStudent), new { studentId = enrollment.StudentID }, ToReadDto(enrollment));
        }

        // PUT: api/enrollment/5/grade
        [Authorize(Roles = Roles.Admin + "," + Roles.Teacher)]
        [HttpPut("{id}/grade")]
        public async Task<IActionResult> AssignGrade(int id, GradeUpdateDto dto)
        {
            var enrollment = await _context.Enrollments.FindAsync(id);
            if (enrollment == null)
            {
                return NotFound(new { message = $"Enrollment with ID {id} was not found." });
            }

            enrollment.Grade = dto.Grade;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/enrollment/5
        [Authorize(Roles = Roles.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Unenroll(int id)
        {
            var enrollment = await _context.Enrollments.FindAsync(id);
            if (enrollment == null)
            {
                return NotFound(new { message = $"Enrollment with ID {id} was not found." });
            }

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static EnrollmentReadDto ToReadDto(Enrollment e) => new()
        {
            EnrollmentID = e.EnrollmentID,
            StudentID = e.StudentID,
            StudentName = e.Student?.Name ?? "",
            CourseID = e.CourseID,
            CourseName = e.Course?.CourseName ?? "",
            EnrolledOn = e.EnrolledOn,
            Grade = e.Grade
        };
    }
}
