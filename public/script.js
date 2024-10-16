const fetchTasks = async () => {
    const response = await fetch('/tasks');
    const tasks = await response.json();
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.description}</span>
            <button onclick="completeTask(${task.id}, ${task.completed})">
                ${task.completed ? 'Undo' : 'Complete'}
            </button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(li);
    });
};

const addTask = async () => {
    const description = document.getElementById('task-input').value;
    if (!description) return;
    await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
    });
    fetchTasks();
};

const completeTask = async (id, completed) => {
    await fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
    });
    fetchTasks();
};

const deleteTask = async (id) => {
    await fetch(`/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
};

window.onload = fetchTasks;
