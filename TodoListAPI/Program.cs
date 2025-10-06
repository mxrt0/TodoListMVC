using Microsoft.EntityFrameworkCore;
using TodoListAPI.Data;
using TodoListAPI.Models;
using TodoListAPI.Utils;

namespace TodoListAPI
{
    public class Program
    {
        public static async Task Main(string[] args)
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

            builder.Services.AddSingleton<DbCache>(sp =>
            {
                var connectionString = builder.Configuration.GetConnectionString("DefaultConnectionString");

                return new DbCache(() =>
                {
                    var options = new DbContextOptionsBuilder<ToDoListDbContext>()
                        .UseSqlServer(connectionString)
                        .Options;

                    return new ToDoListDbContext(options);
                });
            });

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var seeder = new SeedData();
                await seeder.SeedTasks(scope.ServiceProvider);
            }

            app.UseCors("AllowSPA");

            app.UseHttpsRedirection();

            // Endpoints
            app.MapPost("/tasks/add", async (ToDoItem task, ToDoListDbContext db, DbCache cache) =>
            {
                cache.ClearCache();
                db.ToDoList.Add(task);
                await db.SaveChangesAsync();

                return Results.Created($"/tasks/{task.Id}", task);
            });

            app.MapPost("/tasks/{id}/complete", async (int id, ToDoListDbContext db, DbCache cache) =>
            {
                cache.ClearCache();

                var taskToComplete = db.ToDoList.Find(id);
                taskToComplete!.IsCompleted = true;

                await db.SaveChangesAsync();
                return Results.NoContent();
            });

            app.MapGet("/tasks", (DbCache cache) =>
            {
                return Results.Json(cache.GetTasks());
            });

            app.MapDelete("/tasks/{id}", async (int id, ToDoListDbContext db, DbCache cache) =>
            {
                cache.ClearCache();

                var taskToDelete = db.ToDoList.Find(id);

                taskToDelete!.IsDeleted = true;
                await db.SaveChangesAsync();

                return Results.NoContent();
            });

            app.MapPut("/tasks/{id}", async (int id, UpdateToDoItemDto dto, ToDoListDbContext db, DbCache cache) =>
            {
                cache.ClearCache();

                var taskToUpdate = db.ToDoList.Find(id);

                taskToUpdate!.MapFromDto(dto);
                await db.SaveChangesAsync();

                return Results.NoContent();
            });

            app.Run();
        }
    }
}
