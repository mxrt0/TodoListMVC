using Microsoft.EntityFrameworkCore;
using TodoListAPI.Data;
using TodoListAPI.Models;

namespace TodoListAPI.Utils;

public class DbCache
{
    private IEnumerable<ToDoItem>? _cache;
    private readonly Func<ToDoListDbContext> _dbFactory;
    private readonly object _lock = new object();

    public DbCache(Func<ToDoListDbContext> dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public IEnumerable<ToDoItem> GetTasks()
    {
        lock (_lock)
        {
            if (_cache != null)
                return _cache;

            using var db = _dbFactory();
            _cache = db.ToDoList.AsNoTracking().ToList();
            return _cache;
        }
    }

    public void ClearCache()
    {
        lock (_lock)
        {
            _cache = null;
        }
    }
}
