using Backend.Database;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Get connection string
var connectionString = builder.Configuration.GetConnectionString("PostgreSQLConnection") ??
                       throw new ArgumentNullException("No tienes una cadena de conexión");

// Register DbContext
builder.Services.AddDbContext<DataContext>(options => options.UseNpgsql(connectionString));

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

app.UseAuthorization();

app.MapControllers();

app.Run();
