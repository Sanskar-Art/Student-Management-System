# Student Management System

A full-stack Student Management System built with **ASP.NET Core Web API**, **Entity Framework Core**, **SQL Server**, and **JWT authentication**, with a **React.js + MUI** frontend.

## Features
- Student CRUD with search, sorting, and pagination
- Course management
- Enrollment of students into courses, with grade assignment
- JWT-based authentication with role-based access control (Admin / Teacher)
- Centralized global exception handling
- Swagger/OpenAPI docs with built-in JWT "Authorize" support
- xUnit test project covering controller logic (EF Core InMemory provider)
- React.js frontend: login/register, student/course/enrollment management, role-aware UI

## Architecture
```
StudentAPI/
  Controllers/    AuthController, StudentController, CourseController, EnrollmentController
  Models/         Student, Course, Enrollment, User, APIDbContext
  DTOs/           Request/response contracts, decoupled from EF entities
  Services/       ITokenService / TokenService (JWT generation)
  Middleware/     ExceptionHandlingMiddleware (global error handling)
StudentAPI.Tests/ xUnit tests using EF Core InMemory provider
frontend/         React.js + MUI client (see frontend/README.md)
```

## Data Model
- **Student** — Name, Email, ContactNumber, Age, EnrollmentDate
- **Course** — CourseCode, CourseName, Credits
- **Enrollment** — join entity linking Student <-> Course, with an optional Grade
- **User** — Username, PasswordHash, Role (Admin / Teacher) — used for authentication

## Technologies Used
- ASP.NET Core Web API (.NET 6)
- Entity Framework Core + SQL Server
- JWT Bearer Authentication (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- Swagger / Swashbuckle
- xUnit + EF Core InMemory (testing)
- React.js (frontend — in progress)

## Getting Started

### 1. Configure the database and JWT secret
Update `StudentAPI/appsettings.json`:
```json
"ConnectionStrings": {
  "DevConnection": "Server=(localdb)\\MSSQLLocalDB;Database=StudentDB;Trusted_Connection=True;MultipleActiveResultSets=True;"
},
"Jwt": {
  "Key": "REPLACE_WITH_A_LONG_RANDOM_SECRET_AT_LEAST_32_CHARS",
  "Issuer": "StudentAPI",
  "Audience": "StudentAPIClient",
  "ExpiresInHours": "8"
}
```
For a real deployment, don't commit the JWT key — use `dotnet user-secrets` locally or environment variables/Azure Key Vault in production.

### 2. Restore packages and create the database
```bash
cd StudentAPI
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 3. Run the API
```bash
dotnet run
```
Swagger UI will be available at `https://localhost:{port}/swagger`.

### 4. Run the tests
```bash
cd StudentAPI.Tests
dotnet test
```

### 5. Run the frontend
```bash
cd frontend
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your running API
npm run dev
```
Then open the printed local URL (e.g. `http://localhost:5173`), register an
account (Admin or Teacher), and sign in.

## API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register a new user | Public |
| POST | /api/auth/login | Log in, receive a JWT | Public |
| GET | /api/auth/me | Get the current user's identity | Authenticated |

### Students
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/student?search=&sortBy=&sortDesc=&page=&pageSize= | Search, sort, and page students | Authenticated |
| GET | /api/student/{id} | Get student by ID | Authenticated |
| POST | /api/student | Add student | Admin, Teacher |
| PUT | /api/student/{id} | Update student | Admin, Teacher |
| DELETE | /api/student/{id} | Delete student | Admin |

### Courses
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/course | List all courses | Authenticated |
| GET | /api/course/{id} | Get course by ID | Authenticated |
| POST | /api/course | Add course | Admin |
| DELETE | /api/course/{id} | Delete course | Admin |

### Enrollments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/enrollment/student/{studentId} | Courses for a student | Authenticated |
| GET | /api/enrollment/course/{courseId} | Roster for a course | Authenticated |
| POST | /api/enrollment | Enroll a student in a course | Admin, Teacher |
| PUT | /api/enrollment/{id}/grade | Assign/update a grade | Admin, Teacher |
| DELETE | /api/enrollment/{id} | Unenroll a student | Admin |

## Author
Sanskar Chaurasia
