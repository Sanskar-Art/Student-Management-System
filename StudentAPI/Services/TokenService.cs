using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using StudentAPI.Models;

namespace StudentAPI.Services
{
    public interface ITokenService
    {
        (string token, DateTime expiresAt) CreateToken(User user);
    }

    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;

        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public (string token, DateTime expiresAt) CreateToken(User user)
        {
            var jwtSection = _config.GetSection("Jwt");
            var key = jwtSection["Key"]
                ?? throw new InvalidOperationException("Jwt:Key is not configured.");

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Username),
                new(ClaimTypes.Name, user.Username),
                new(ClaimTypes.Role, user.Role),
                new("userId", user.UserID.ToString())
            };

            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                SecurityAlgorithms.HmacSha256);

            var expiresAt = DateTime.UtcNow.AddHours(
                double.Parse(jwtSection["ExpiresInHours"] ?? "8"));

            var token = new JwtSecurityToken(
                issuer: jwtSection["Issuer"],
                audience: jwtSection["Audience"],
                claims: claims,
                expires: expiresAt,
                signingCredentials: credentials);

            return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
        }
    }
}
