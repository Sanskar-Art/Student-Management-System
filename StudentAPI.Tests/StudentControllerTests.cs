using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAPI.Controllers;
using StudentAPI.DTOs;
using StudentAPI.Models;
using Xunit;

namespace StudentAPI.Tests
{
    public class StudentControllerTests
    {
        // Each test gets a fresh, isolated in-memory database so tests
        // never affect each other's data.
        private static APIDbContext CreateContext()
        {
            var options = new DbContextOptionsBuilder<APIDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new APIDbContext(options);
        }

        [Fact]
        public async Task PostStudent_AddsStudent_AndReturnsCreatedResult()
        {
            // Arrange
            await using var context = CreateContext();
            var controller = new StudentController(context);
            var dto = new StudentCreateDto
            {
                Name = "Asha Verma",
                Email = "asha.verma@example.com",
                ContactNumber = 9876543210,
                Age = 21
            };

            // Act
            var result = await controller.PostStudent(dto);

            // Assert
            var created = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returned = Assert.IsType<StudentReadDto>(created.Value);
            Assert.Equal("Asha Verma", returned.Name);
            Assert.Equal(1, await context.Students.CountAsync());
        }

        [Fact]
        public async Task GetStudent_WithUnknownId_ReturnsNotFound()
        {
            await using var context = CreateContext();
            var controller = new StudentController(context);

            var result = await controller.GetStudent(999);

            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetStudents_FiltersBySearchTerm()
        {
            await using var context = CreateContext();
            context.Students.AddRange(
                new Student { Name = "Rahul Singh", Email = "rahul@example.com", Age = 22, ContactNumber = 1111111111 },
                new Student { Name = "Priya Nair", Email = "priya@example.com", Age = 23, ContactNumber = 2222222222 }
            );
            await context.SaveChangesAsync();

            var controller = new StudentController(context);

            var result = await controller.GetStudents(search: "rahul", sortBy: "name", sortDesc: false, page: 1, pageSize: 10);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var paged = Assert.IsType<PagedResult<StudentReadDto>>(okResult.Value);
            Assert.Single(paged.Items);
            Assert.Equal("Rahul Singh", paged.Items[0].Name);
        }

        [Fact]
        public async Task DeleteStudent_RemovesStudent()
        {
            await using var context = CreateContext();
            var student = new Student { Name = "Test Student", Email = "test@example.com", Age = 20, ContactNumber = 3333333333 };
            context.Students.Add(student);
            await context.SaveChangesAsync();

            var controller = new StudentController(context);
            var result = await controller.DeleteStudent(student.StudentID);

            Assert.IsType<NoContentResult>(result);
            Assert.Equal(0, await context.Students.CountAsync());
        }
    }
}
