using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace PsychologyClinic.Controllers
{
    [Route("api/admin")]
    public class AdminController : Controller
    {
        public static string publicApiKey = "";
        [HttpPost("login")]
        public IActionResult Login(string name, string password)
        {
            if (name == "admin" && password == "admin")
            {
                // Generate API key
                var apiKey = GenerateApiKey();
                publicApiKey = apiKey;
                // Return the generated API key
                return Ok(new { ApiKey = apiKey });
            }

            return Unauthorized("Invalid credentials.");
        }

        // Generate a unique API Key
        private string GenerateApiKey()
        {
            using (var sha256 = SHA256.Create())
            {
                var keyData = Guid.NewGuid().ToString();
                var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(keyData));
                return Convert.ToBase64String(hashBytes);
            }
        }
    }
}
