using System.Net;
using System.Text.Json;

namespace StudentAPI.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception while processing {Method} {Path}",
                    context.Request.Method, context.Request.Path);

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var payload = JsonSerializer.Serialize(new
                {
                    status = context.Response.StatusCode,
                    message = "An unexpected error occurred. Please try again later.",
                    // Only leak exception detail in Development to avoid
                    // exposing internals in production.
                    detail = context.RequestServices
                        .GetRequiredService<IHostEnvironment>()
                        .IsDevelopment() ? ex.Message : null
                });

                await context.Response.WriteAsync(payload);
            }
        }
    }

    public static class ExceptionHandlingMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalExceptionHandling(this IApplicationBuilder app)
        {
            return app.UseMiddleware<ExceptionHandlingMiddleware>();
        }
    }
}
