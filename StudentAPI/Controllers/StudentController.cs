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
    public class StudentController : ControllerBase
    {
        private readonly APIDbContext _context;

        public StudentController(APIDbContext context)
        {
            _context = context;
        }

        // GET: api/student?search=&sortBy=name&sortDesc=false&page=1&pageSize=10
        [HttpGet]
        public async Task<ActionResult<PagedResult<StudentReadDto>>> GetStudents(
            [FromQuery] string? search,
            [FromQuery] string sortBy = "name",
            [FromQuery] bool sortDesc = false,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            page = page < 1 ? 1 : page;
            pageSize = pageSize is < 1 or > 100 ? 10 : pageSize;

            var query = _context.Students.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(s =>
                    s.Name.ToLower().Contains(term) ||
                    s.Email.ToLower().Contains(term));
            }

            query = sortBy.ToLower() switch
            {
                "age" => sortDesc ? query.OrderByDescending(s => s.Age) : query.OrderBy(s => s.Age),
                "enrollmentdate" => sortDesc ? query.OrderByDescending(s => s.EnrollmentDate) : query.OrderBy(s => s.EnrollmentDate),
                _ => sortDesc ? query.OrderByDescending(s => s.Name) : query.OrderBy(s => s.Name),
            };

            var totalCount = await query.CountAsync();

            var students = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(s => ToReadDto(s))
                .ToListAsync();

            return Ok(new PagedResult<StudentReadDto>
            {
                Items = students,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            });
        }

        // GET: api/student/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentReadDto>> GetStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound(new { message = $"Student with ID {id} was not found." });
            }

            return Ok(ToReadDto(student));
        }

        // POST: api/student
        [Authorize(Roles = Roles.Admin + "," + Roles.Teacher)]
        [HttpPost]
        public async Task<ActionResult<StudentReadDto>> PostStudent(StudentCreateDto dto)
        {
            var student = new Student
            {
                Name = dto.Name,
                Email = dto.Email,
                ContactNumber = dto.ContactNumber,
                Age = dto.Age,
                EnrollmentDate = DateTime.UtcNow
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStudent), new { id = student.StudentID }, ToReadDto(student));
        }

        // PUT: api/student/5
        [Authorize(Roles = Roles.Admin + "," + Roles.Teacher)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(int id, StudentUpdateDto dto)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound(new { message = $"Student with ID {id} was not found." });
            }

            student.Name = dto.Name;
            student.Email = dto.Email;
            student.ContactNumber = dto.ContactNumber;
            student.Age = dto.Age;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/student/5
        [Authorize(Roles = Roles.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound(new { message = $"Student with ID {id} was not found." });
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static StudentReadDto ToReadDto(Student s) => new()
        {
            StudentID = s.StudentID,
            Name = s.Name,
            Email = s.Email,
            ContactNumber = s.ContactNumber,
            Age = s.Age,
            EnrollmentDate = s.EnrollmentDate
        };
    }
}
