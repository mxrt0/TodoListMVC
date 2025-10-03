document.addEventListener("DOMContentLoaded", () => {
    console.log("Loaded");
    const addBtn = document.getElementById('add-btn');
    const input = document.getElementById('new-todo-input');
    const tasks = document.getElementById('tasks');

    addBtn.addEventListener('click', () => {
        const taskText = input.value;
        if (taskText) {
            const task = document.createElement('li');
            task.textContent = taskText;

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'task-buttons';

            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.textContent = "Edit";

            const delBtn = document.createElement('button');
            delBtn.classList.add('delete-btn');
            delBtn.textContent = "Delete";

            buttonsDiv.appendChild(editBtn);
            buttonsDiv.appendChild(delBtn);

            task.appendChild(buttonsDiv);

            tasks.appendChild(task);
            input.value = "";
        }
    });
});



