using Microsoft.EntityFrameworkCore;

namespace Backend.Database
{
    public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
    {
        public async Task<(bool IsConnected, string Message)> CheckDatabaseConnectionAsync()
        {
            try
            {
                // A simple query to verify the connection
                using (var transaction = await this.Database.BeginTransactionAsync())
                {
                    await transaction.CommitAsync();
                    return (true, "Database connection successful!");
                }
            }
            catch (Exception ex)
            {
                return (false, $"Error when trying to connect to the database: {ex.Message}");
            }
        }
    }
}
