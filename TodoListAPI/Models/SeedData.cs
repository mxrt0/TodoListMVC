using Microsoft.EntityFrameworkCore;
using TodoListAPI.Data;

namespace TodoListAPI.Models;

public class SeedData
{
    public async Task SeedTasks(IServiceProvider provider)
    {
        using var db = new ToDoListDbContext(provider.GetRequiredService<DbContextOptions<ToDoListDbContext>>());
        if (db.ToDoList.Any())
        {
            db.ToDoList.RemoveRange(db.ToDoList);
        }

        var tasks = Enumerable.Range(1, 1000).Select(i => new ToDoItem
        {
            Title = $"Task {i}",
            CreatedAt = DateTime.UtcNow.AddMinutes(i % 2 == 0 ? i + 2 : i + 1),
            DueDate = DateTime.UtcNow.AddDays(i % 2 == 0 ? i + 1 : i + 2),
            IsCompleted = i % 2 == 0 ? true : false,
            IsDeleted = false
        }).ToList();
        await db.ToDoList.AddRangeAsync(tasks);
        await db.SaveChangesAsync();
    }
}
