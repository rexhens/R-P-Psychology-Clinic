namespace PsychologyClinic
{
    public class ApiKeyMiddleWare
    {
        private readonly RequestDelegate _next;

        public ApiKeyMiddleWare(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var apiKey = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrEmpty(apiKey) || !IsValidApiKey(apiKey))
            {
                context.Response.StatusCode = 401; // Unauthorized
                await context.Response.WriteAsync("Invalid or missing API key");
                return;
            }

            // Proceed if the API key is valid
            await _next(context);
        }

        private bool IsValidApiKey(string apiKey)
        {
            // Implement logic to check if the API key is valid
            // For example, check the API key against a stored list or database
            return apiKey == "expected-api-key"; // Example, replace with actual validation logic
        }
    }
}
