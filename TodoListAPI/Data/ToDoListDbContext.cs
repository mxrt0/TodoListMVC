using Microsoft.EntityFrameworkCore;
using TodoListAPI.Models;
namespace TodoListAPI.Data;

public class ToDoListDbContext : DbContext
{
    public ToDoListDbContext(DbContextOptions options) : base(options)
    {

    }
    public DbSet<ToDoItem> ToDoList { get; set; }

}


