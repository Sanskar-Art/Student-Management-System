# Build stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

WORKDIR /src

# Copy project file
COPY StudentAPI/StudentAPI.csproj StudentAPI/

# Restore dependencies
RUN dotnet restore StudentAPI/StudentAPI.csproj

# Copy source code
COPY StudentAPI/ StudentAPI/

# Build and publish
RUN dotnet publish StudentAPI/StudentAPI.csproj \
    -c Release \
    -o /app/publish \
    --no-restore


# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

# Render uses the PORT environment variable
ENTRYPOINT ["sh", "-c", "dotnet StudentAPI.dll --urls http://0.0.0.0:${PORT:-10000}"]