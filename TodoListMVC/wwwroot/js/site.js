const apiBaseAddress = 'https://localhost:7090';
let allTasks = [];
const tasksHeader = document.getElementById('tasks-header');
const addBtn = document.getElementById('add-btn');
const taskInput = document.getElementById('new-todo-input');

const tasksList = document.getElementById('tasks');
const calendarContainer = document.getElementById('calendar-container');
const dueDateInput = document.getElementById('date-input');
const error = document.getElementById('error-message');

let tasks = [];
let selectedDate = null;
async function init() {
    let ready = false;
    while (!ready) {
        try {
            const test = await fetch(`${apiBaseAddress}/status`);
            if (test.ok) {
                ready = true;
            } else {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
        catch (err) {
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

    await renderTasks();
    tasks = Array.from(tasksList.querySelectorAll('li'));
    const today = new Date();
    generateCalendar(today.getFullYear(), today.getMonth());
}

init();

const resetBtn = document.createElement('button');
resetBtn.className = 'reset-btn';
resetBtn.textContent = 'Show All Tasks';
resetBtn.style.display = 'none';

resetBtn.addEventListener('click', () => {
    selectedDate = null;         
    searchInput.value = '';      
    renderTasks();   
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
});
calendarContainer.parentElement.insertBefore(resetBtn, calendarContainer.nextSibling);

const searchDiv = document.getElementById('search-container');
const searchInput = searchDiv.querySelector('input');

let debounceTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        filterTasks(searchInput.value);
    }, 150);
});

function getAllTasks() {
    return Array.from(tasksList.querySelectorAll('li'));
}

function filterTasks(searchParam) {
    searchParam = searchParam.trim().toLowerCase();
    let filtered = tasks;

    if (selectedDate) {
        const dateStr = selectedDate.toISOString().split('T')[0];
        filtered = filtered.filter(task => task.dataset.due === dateStr);
    }

    tasksList.innerHTML = '';

    if (!searchParam && !selectedDate) {
        renderTasks();
        return;
    }

    const matches = filtered.filter(task => {
        const span = task.querySelector('span');
        return span && span.textContent.toLowerCase().includes(searchParam);
    });

    if (matches.length === 0) {
        const noRes = document.createElement('li');
        noRes.textContent = 'No matching tasks';
        noRes.style.opacity = '0.6';
        noRes.style.fontStyle = 'italic';
        tasksList.appendChild(noRes);
        return;
    }

    matches.forEach(task => tasksList.appendChild(task));

    matches[0].scrollIntoView({ behavior: 'auto', block: 'start' });
 
}

function filterTasksByDate(date) {
    const dateStr = date.toISOString().split('T')[0];

    tasksList.innerHTML = '';

    const matches = tasks.filter(task => {
        const due = task.dataset.due;
        return due === dateStr;
    });

    if (matches.length === 0) {
        const noRes = document.createElement('li');
        noRes.textContent = 'No tasks on this date';
        noRes.style.opacity = '0.6';
        noRes.style.fontStyle = 'italic';
        tasksList.appendChild(noRes);
        return;
    }

    matches.forEach(task => tasksList.appendChild(task));
}

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
                taskInput.value = "";
                dueDateInput = "";

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
        if (!response.ok) {
            throw new Error("Response was not OK!");
        } 
        const data = await response.json();

        allTasks = data.filter(item => !item.isDeleted);
        tasksList.innerHTML = "";



        if (allTasks.length > 0) {
            tasksHeader.style.display = 'block';
            searchDiv.style.display = 'block';
            document.getElementById('calendar-text').style.display = 'block';
            calendarContainer.style.display = 'grid';
            resetBtn.style.display = 'block';
            
            allTasks.forEach(taskObj => {

                const task = document.createElement("li");

                task.setAttribute('data-due', new Date(taskObj.dueDate.trim()).toISOString().split('T')[0]);

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

                const editSuccessSpan = document.createElement("span");
                editSuccessSpan.style.display = 'none';
                editSuccessSpan.className = 'success-span';

                const editBtn = document.createElement("button");
                editBtn.className = "edit-btn";
                editBtn.textContent = "Edit";
                const editIcon = document.createElement('img');
                editIcon.src = 'img/edit.png';
                editIcon.alt = 'Edit';
                editIcon.className = 'btn-icon';
                editIcon.style.marginBottom = '3px';
                editBtn.appendChild(editIcon);

                const markCompleteBtn = document.createElement("button");
                markCompleteBtn.className = 'save-btn';
                markCompleteBtn.textContent = "Mark As Completed";
                const markIcon = document.createElement('img');
                markIcon.src = 'img/mark.png';
                markIcon.alt = 'Mark';
                markIcon.className = 'btn-icon';
                markCompleteBtn.appendChild(markIcon);
                

                const delBtn = document.createElement("button");
                delBtn.classList.add("delete-btn");
                delBtn.textContent = "Delete";
                const delIcon = document.createElement('img');
                delIcon.src = 'img/bin.png';
                delIcon.alt = 'Del';
                delIcon.className = 'btn-icon';
                delBtn.appendChild(delIcon);

                let isEditing = false;
                let isDeleting = false;

                editBtn.addEventListener('click', () => {
                    markCompleteBtn.style.display = 'none';
                    editErrorSpan.style.display = 'none';

                    if (editBtn.textContent === "Confirm") {
                        isDeleting = false;  
                        deleteTask(taskObj.id, editInput.value, new Date(editDateInput.value.trim()));
                        resetTaskUI();
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
                        editBtn.textContent = 'Save'; 
                        delBtn.textContent = 'Cancel';
                        if (delBtn.contains(delIcon)) {
                            delBtn.removeChild(delIcon);
                        }
                        if (editBtn.contains(delIcon)) {
                            editBtn.removeChild(editIcon);
                        } 
                        isEditing = true;
  
                    }
                    else if (editBtn.textContent === "Save") {
                        const newTitle = editInput.value;
                        const newDueDate = new Date(editDateInput.value.trim());
                        if (newTitle) {
                            if (newDueDate && !isNaN(newDueDate.getTime())) {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                if (newDueDate.getTime() > today) {

                                    isEditing = false;
                                    editSuccessSpan.style.display = 'block';
                                    editSuccessSpan.textContent = 'Task updated successfully!';
                                    setTimeout(() => {
                                        editSuccessSpan.style.display = 'none';
                                        updateTask(taskObj.id, newTitle, newDueDate);
                                        resetTaskUI();
                                    }, 1500);       
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
                    markCompleteBtn.style.display = 'none';

                    if (Boolean(taskObj.isCompleted)) {
                        deleteTask(taskObj.id);
                        return;
                    }
                    if (delBtn.textContent === "Cancel") {
                        isDeleting = false;
                        resetTaskUI(); 
                        return;
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
                buttonsDiv.appendChild(markCompleteBtn);
                buttonsDiv.appendChild(delBtn);             
                buttonsDiv.appendChild(editErrorSpan);
                buttonsDiv.appendChild(editSuccessSpan);

                task.appendChild(textSpan);
                
                task.appendChild(buttonsDiv);

                if (taskObj.isCompleted) {
                    markCompleteBtn.innerHTML = 'Completed <img class="btn-icon btn-icon-large" src="img/completed.png">';
                    markCompleteBtn.disabled = true;

                    task.classList.add('done');
                    
                    editBtn.style.display = 'none';
                }
                else {
                    markCompleteBtn.addEventListener('click', () => {
                        editBtn.style.display = 'none';
                        markCompleteBtn.innerHTML = 'Completed <img class="btn-icon btn-icon-large" src="img/completed.png">';
                        markCompleteBtn.disabled = true;

                        task.classList.add('done', 'animate');
                        task.addEventListener('animationend', () => {
                            task.classList.remove('animate');
                            completeTask(taskObj.id);
                        });    
                    })
                };

                tasksList.appendChild(task);

                function resetTaskUI() {
                    editBtn.className = 'edit-btn';
                    editBtn.textContent = 'Edit';
                    if (!editBtn.contains(editIcon)) editBtn.appendChild(editIcon);

                    buttonsDiv.style.flexDirection = 'row';
                    buttonsDiv.style.alignItems = 'center';
                    buttonsDiv.style.gap = '4px';

                    markCompleteBtn.style.display = 'block';

                    textSpan.style.display = 'block';
                    textSpan.textContent = taskObj.title;
                    editInput.style.display = 'none';
                    editInput.disabled = false;

                    editDateInput.style.display = 'none';
                    editDateInput.disabled = false;
                    editErrorSpan.style.display = 'none';

                    delBtn.textContent = 'Delete';
                    if (!delBtn.contains(delIcon)) delBtn.appendChild(delIcon);
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
    tasks = Array.from(tasksList.querySelectorAll('li'));
}

async function completeTask(taskId) {
    try {
        const response = await fetch(`${apiBaseAddress}/tasks/${taskId}/complete`, {
            method: 'POST',
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

function generateCalendar(year, month) {
    calendarContainer.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
 
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        dayDiv.classList.add('calendar-day');

        dayDiv.addEventListener('click', () => {
            selectedDate = new Date(year, month, day);
            
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            dayDiv.classList.add('selected');

            filterTasks(searchInput.value);
        });

        calendarContainer.appendChild(dayDiv);
    }
}







