const apiBaseAddress = 'https://localhost:7090';
let allTasks = [];
const tasksHeader = document.getElementById('tasks-header');

const addBtn = document.getElementById('add-btn');
const taskInput = document.getElementById('new-todo-input');

const tasksList = document.getElementById('tasks');
const dueDateInput = document.getElementById('date-input');
const error = document.getElementById('error-message');

renderTasks();

addBtn.addEventListener('click', () => {

    error.style.display = 'none';
    const taskText = taskInput.value;
    const dueDate = new Date(dueDateInput.value.trim());

    if (taskText) {

        if (dueDate && !isNaN(dueDate.getTime())) {

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (dueDate.getTime() > today) {

                addTask(taskText, dueDate); 

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

const observer = new MutationObserver(() => {

    if (tasksList.querySelector('li')) {
        tasksHeader.style.display = 'inline-block';
    }
    else {
        tasksHeader.style.display = 'none';
    }

});

observer.observe(tasksList, { childList: true });

async function addTask(taskTitle, taskDueDate) {
    try {
        const task = {
            title: taskTitle,
            createdAt: new Date(),
            dueDate: taskDueDate
        };

        const response = await fetch(`${apiBaseAddress}/tasks/add`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        });

        if (!response.ok) {
            throw new Error("Response was not OK!");
        }

        await renderTasks();

    }
    catch (err) {
        error.textContent = err;
    }
}


async function renderTasks() {
    try {
        const response = await fetch(`${apiBaseAddress}/tasks`);
        if (!response.ok) throw new Error("Response was not OK!");
        const data = await response.json();

        allTasks = data;
        tasksList.innerHTML = "";

        if (allTasks.length > 0) {
            tasksHeader.style.display = "block";

            allTasks.forEach(taskObj => {
                const task = document.createElement("li");

                const textSpan = document.createElement("span");
                textSpan.className = "task-text";
                textSpan.textContent = taskObj.title;

                const buttonsDiv = document.createElement("div");
                buttonsDiv.className = "task-buttons";

                const editBtn = document.createElement("button");
                editBtn.classList.add("edit-btn");
                editBtn.textContent = "Edit";

                const delBtn = document.createElement("button");
                delBtn.classList.add("delete-btn");
                delBtn.textContent = "Delete";
                delBtn.addEventListener("click", () => {
                    deleteTask(taskObj.id);
                });

                buttonsDiv.appendChild(editBtn);
                buttonsDiv.appendChild(delBtn);

                task.appendChild(textSpan);
                task.appendChild(buttonsDiv);

                tasksList.appendChild(task);
            });
        }
        else {
            tasksHeader.style.display = "none";
        }

        taskInput.value = "";
        dueDateInput.value = "";
    }
    catch (err) {
        error.textContent = err;
    }
}

async function deleteTask(taskId) {
    try {
        const response = await fetch(`${apiBaseAddress}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error("Response was not OK!");

        await renderTasks();
    } catch (err) {
        error.textContent = err;
    }
}




