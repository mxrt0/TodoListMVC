using Microsoft.EntityFrameworkCore;
using TodoListAPI.Data;

namespace TodoListAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(setup =>
            {
                setup.AddPolicy("AllowSPA", policy =>
                {
                    policy.WithOrigins("https://localhost:7077")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                });
            });

            builder.Services.AddDbContext<ToDoListDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnectionString"));
            });

            var app = builder.Build();

            app.UseCors("AllowSPA");

            app.UseHttpsRedirection();

            // Endpoints

            app.Run();
        }
    }
}
