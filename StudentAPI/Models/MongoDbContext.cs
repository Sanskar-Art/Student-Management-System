using MongoDB.Driver;

namespace StudentAPI.Models
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IConfiguration configuration)
        {
            var connectionString = configuration["MongoDB:ConnectionString"];
            var databaseName = configuration["MongoDB:DatabaseName"];

            if (string.IsNullOrEmpty(connectionString))
                throw new InvalidOperationException("MongoDB connection string is not configured.");

            if (string.IsNullOrEmpty(databaseName))
                throw new InvalidOperationException("MongoDB database name is not configured.");

            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }

        public IMongoCollection<Student> Students =>
            _database.GetCollection<Student>("Students");

        public IMongoCollection<Course> Courses =>
            _database.GetCollection<Course>("Courses");

        public IMongoCollection<Enrollment> Enrollments =>
            _database.GetCollection<Enrollment>("Enrollments");

        public IMongoCollection<User> Users =>
            _database.GetCollection<User>("Users");
    }
}