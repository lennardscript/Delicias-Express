using Backend.Database;
using Backend.Models.Users;
using Backend.Services.Users;
using DotNetEnv;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Get environment variables
Env.Load();

var host = Environment.GetEnvironmentVariable("POSTGRES_HOST");
var port = Environment.GetEnvironmentVariable("POSTGRES_PORT");
var database = Environment.GetEnvironmentVariable("POSTGRES_DB");
var username = Environment.GetEnvironmentVariable("POSTGRES_USER");
var password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");

if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(database) || string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
{
    throw new Exception("Database connection settings are not set correctly. Please check your environment variables.");
}

// Get connection string
var connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password};";

// Register DbContext
builder.Services.AddDbContext<DataContext>(options => options.UseNpgsql(connectionString));

// Register DbContext
builder.Services.AddDbContext<DataContext>(options => options.UseNpgsql(connectionString));

// Register Identity services
builder.Services.AddIdentity<UserModel, IdentityRole>()
    .AddEntityFrameworkStores<DataContext>();

// Register UserService
builder.Services.AddScoped<UserService>();

// Register authorization services
builder.Services.AddAuthorization();

var app = builder.Build();

// Check database connection
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<DataContext>();
        var (isConnected, message) = context.CheckDatabaseConnectionAsync().GetAwaiter().GetResult();

        if(!isConnected)
        {
            throw new Exception(message);
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while checking the database connection.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
