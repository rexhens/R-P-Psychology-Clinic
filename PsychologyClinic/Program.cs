using PsychologyClinic;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:5173")  // Allow requests from frontend server
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Swagger configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

var app = builder.Build();

// Use CORS middleware before other middleware
app.UseCors("AllowLocalhost");  // Apply the CORS policy here

// Add middleware
// app.UseMiddleware<ApiKeyMiddleWare>(); // Uncomment if you have custom middleware

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Authorization middleware
app.UseAuthorization();

app.MapControllers();

app.Run();
