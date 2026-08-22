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
    public class CourseController : ControllerBase
    {
        private readonly APIDbContext _context;

        public CourseController(APIDbContext context)
        {
            _context = context;
        }

        // GET: api/course
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseReadDto>>> GetCourses()
        {
            var courses = await _context.Courses
                .Select(c => new CourseReadDto
                {
                    CourseID = c.CourseID,
                    CourseCode = c.CourseCode,
                    CourseName = c.CourseName,
                    Credits = c.Credits
                })
                .ToListAsync();

            return Ok(courses);
        }

        // GET: api/course/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CourseReadDto>> GetCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound(new { message = $"Course with ID {id} was not found." });
            }

            return Ok(new CourseReadDto
            {
                CourseID = course.CourseID,
                CourseCode = course.CourseCode,
                CourseName = course.CourseName,
                Credits = course.Credits
            });
        }

        // POST: api/course
        [Authorize(Roles = Roles.Admin)]
        [HttpPost]
        public async Task<ActionResult<CourseReadDto>> PostCourse(CourseCreateDto dto)
        {
            var course = new Course
            {
                CourseCode = dto.CourseCode,
                CourseName = dto.CourseName,
                Credits = dto.Credits
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCourse), new { id = course.CourseID }, new CourseReadDto
            {
                CourseID = course.CourseID,
                CourseCode = course.CourseCode,
                CourseName = course.CourseName,
                Credits = course.Credits
            });
        }

        // DELETE: api/course/5
        [Authorize(Roles = Roles.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound(new { message = $"Course with ID {id} was not found." });
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
