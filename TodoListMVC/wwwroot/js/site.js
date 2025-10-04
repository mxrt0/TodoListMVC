document.addEventListener("DOMContentLoaded", () => {

    const addBtn = document.getElementById('add-btn');
    const taskInput = document.getElementById('new-todo-input');
    const tasks = document.getElementById('tasks');
    const dueDateInput = document.getElementById('date-input');
    const error = document.getElementById('error-message');

    addBtn.addEventListener('click', () => {

        error.style.display = 'none';
        const taskText = taskInput.value;
        const dueDate = new Date(dueDateInput.value.trim());

        if (taskText) {

            if (dueDate && !isNaN(dueDate.getTime())) {

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (dueDate.getTime() > today) {
                    const task = document.createElement('li');
                    const textSpan = document.createElement('span');
                    textSpan.className = 'task-text';
                    textSpan.textContent = taskText;

                    const buttonsDiv = document.createElement('div');
                    buttonsDiv.className = 'task-buttons';

                    const editBtn = document.createElement('button');
                    editBtn.classList.add('edit-btn');
                    editBtn.textContent = "Edit";

                    const delBtn = document.createElement('button');
                    delBtn.classList.add('delete-btn');
                    delBtn.addEventListener('click', () => {
                        task.remove();
                    });
                    delBtn.textContent = "Delete";

                    buttonsDiv.appendChild(editBtn);
                    buttonsDiv.appendChild(delBtn);

                    task.appendChild(textSpan);
                    task.appendChild(buttonsDiv);

                    tasks.appendChild(task);
                    taskInput.value = "";
                    dueDateInput.value = "";
                }
                else {
                    error.style.display = 'block';
                    dueDateInput.focus();
                    error.textContent = "Invalid due date!";
                }
                
            }
            else {
                error.style.display = 'block';
                dueDateInput.focus();
                error.textContent = "Due date cannot be empty!";
            }
            
        }
        else {

            error.style.display = 'block';
            taskInput.focus();
            error.textContent = "Task title cannot be empty!";

        }
    });

    const tasksHeader = document.getElementById('tasks-header');

    const observer = new MutationObserver(() => {

        if (tasks.querySelector('li')) {
            tasksHeader.style.display = 'inline-block';
        }
        else {
            tasksHeader.style.display = 'none';
        }

    });

    observer.observe(tasks, { childList: true });
});



