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
            error.textContent = "Due date cannot be empty or NaN!";
        }
            
    }
    else {

        error.style.display = 'block';
        taskInput.focus();
        error.textContent = "Task title cannot be empty!";

    }
});

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

        allTasks = data.filter(item => !item.isDeleted);
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

                const editInput = document.createElement('input');
                editInput.style.display = 'none';
                editInput.placeholder = 'Enter new task name...';
                editInput.className = 'edit-input';

                const editDateInput = document.createElement('input');
                editDateInput.style.display = 'none';
                editDateInput.type = 'date';
                editDateInput.className = 'edit-input';

                const inputsDiv = document.createElement('div');
                inputsDiv.style.display = 'flex';

                inputsDiv.style.flexDirection = 'column';
                inputsDiv.style.gap = '5px';
                inputsDiv.style.marginBottom = '5px';

                inputsDiv.appendChild(editInput);
                inputsDiv.appendChild(editDateInput);

                const editErrorSpan = document.createElement("span");
                editErrorSpan.style.display = 'none';
                editErrorSpan.className = 'error-span';


                const editBtn = document.createElement("button");
                editBtn.classList = "edit-btn";
                editBtn.textContent = "Edit";
                

                const delBtn = document.createElement("button");
                delBtn.classList.add("delete-btn");
                delBtn.textContent = "Delete";

                let isEditing = false;
                let isDeleting = false;

                editBtn.addEventListener('click', () => {

                    editErrorSpan.style.display = 'none';

                    if (isDeleting && !isEditing) {
                       isDeleting = false;
                       deleteTask(taskObj.id);
                    }
                    else if (!isEditing && !isDeleting) {
                        
                        buttonsDiv.style.flexDirection = 'column';
                        buttonsDiv.style.alignItems = 'center';
                        buttonsDiv.style.gap = '4px';

                        textSpan.style.display = 'none';
                        editInput.style.display = 'block';

                        editDateInput.style.display = 'block';
                        editDateInput.value = new Date(taskObj.dueDate.trim()).toISOString().split('T')[0];
                        editInput.disabled = false;
                        editDateInput.disabled = false;

                        editInput.value = textSpan.textContent;
                        editBtn.className = 'save-btn';
                        delBtn.textContent = 'Cancel';
                        isEditing = true;
                    }
                    else if (isEditing && !isDeleting) {
                        const newTitle = editInput.value;
                        const newDueDate = new Date(editDateInput.value.trim());
                        if (newTitle) {
                            if (newDueDate && !isNaN(newDueDate.getTime())) {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                if (newDueDate.getTime() > today) {

                                    resetTaskUI();
                                    updateTask(taskObj.id, newTitle, newDueDate);
                                }
                                else {
                                    editErrorSpan.style.display = 'block';
                                    editDateInput.focus();
                                    editErrorSpan.textContent = 'Invalid due date!';
                                }
                            }
                            else {
                                editErrorSpan.style.display = 'block';
                                editDateInput.focus();
                                editErrorSpan.textContent = 'Due date cannot be empty or NaN!';
                            }
                        }
                        else {
                            editErrorSpan.style.display = 'block';
                            editInput.focus();
                            editErrorSpan.textContent = 'Task title cannot be empty!';
                        }
                        
                    }
                });

                delBtn.addEventListener("click", () => {

                    if (isEditing || isDeleting) {
                        resetTaskUI();  
                    }
                    else if (!isDeleting && !isEditing) {
                        buttonsDiv.style.flexDirection = 'column';
                        buttonsDiv.style.alignItems = 'center';
                        buttonsDiv.style.gap = '4px';

                        textSpan.style.display = 'block';
                        textSpan.textContent = 'Are you sure you want to delete this task?';

                        editInput.style.display = 'block';
                        editDateInput.style.display = 'block';
                        editInput.value = taskObj.title;
                        editInput.disabled = true;

                        editDateInput.value = new Date(taskObj.dueDate.trim()).toISOString().split('T')[0];
                        editDateInput.disabled = true;

                        editBtn.className = 'save-btn';
                        editBtn.textContent = 'Confirm';
                        delBtn.textContent = 'Cancel';
                        isDeleting = true;           
                    }

                });

                buttonsDiv.appendChild(inputsDiv);
                buttonsDiv.appendChild(editBtn);
                buttonsDiv.appendChild(delBtn);
                buttonsDiv.appendChild(editErrorSpan);

                task.appendChild(textSpan);
                task.appendChild(buttonsDiv);

                tasksList.appendChild(task);

                function resetTaskUI() {
                    editBtn.className = 'edit-btn';
                    editBtn.textContent = 'Edit';
                    buttonsDiv.style.flexDirection = 'row';
                    buttonsDiv.style.alignItems = 'center';
                    buttonsDiv.style.gap = '4px';

                    textSpan.style.display = 'block';
                    textSpan.textContent = taskObj.title;
                    editInput.style.display = 'none';
                    editInput.disabled = false;

                    editDateInput.style.display = 'none';
                    editDateInput.disabled = false;
                    editErrorSpan.style.display = 'none';

                    delBtn.textContent = 'Delete';
                    isEditing = false;
                    isDeleting = false;  
                }
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

async function updateTask(taskId, newTitle, newDueDate) {
    try {
        const updatedTask = {
            title: newTitle,
            dueDate: newDueDate
        };

        const response = await fetch(`${apiBaseAddress}/tasks/${taskId}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask)
        });

        if (!response.ok) {
            throw new Error("Response was not OK!");
        }

        await renderTasks();
    }
    catch (err) {
        console.log(err);
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






