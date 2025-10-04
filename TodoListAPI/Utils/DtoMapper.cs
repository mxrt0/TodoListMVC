using TodoListAPI.Models;

namespace TodoListAPI.Utils;

public static class DtoMapper
{
    public static ToDoItem MapFromDto(this ToDoItem entity, UpdateToDoItemDto dto)
    {
        entity.Title = dto.Title;
        entity.DueDate = dto.DueDate;
        return entity;
    }
}
