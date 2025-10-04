using Microsoft.EntityFrameworkCore;
using TodoListAPI.Data;
using TodoListAPI.Models;
using TodoListAPI.Utils;

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
            app.MapPost("/tasks/add", async (ToDoItem task, ToDoListDbContext db) =>
            {
                db.ToDoList.Add(task);
                await db.SaveChangesAsync();

                return Results.Created($"/tasks/{task.Id}", task);
            });

            app.MapGet("/tasks", async (ToDoListDbContext db) =>
            {
                return Results.Json(await db.ToDoList.ToListAsync());
            });

            app.MapDelete("/tasks/{id}", async (int id, ToDoListDbContext db) =>
            {
                var taskToDelete = db.ToDoList.Find(id);

                taskToDelete!.IsDeleted = true;
                await db.SaveChangesAsync();

                return Results.NoContent();
            });

            app.MapPut("/tasks/{id}", async (int id, UpdateToDoItemDto dto, ToDoListDbContext db) =>
            {
                var taskToUpdate = db.ToDoList.Find(id);

                taskToUpdate!.MapFromDto(dto);
                await db.SaveChangesAsync();

                return Results.NoContent();
            });
            app.Run();
        }
    }
}
