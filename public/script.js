// Fetch and display tasks
const fetchTasks = async () => {
    console.log("Fetching all tasks..."); // Log fetch action
    const response = await fetch('/tasks');
    const tasks = await response.json();

    // Separate incomplete and completed tasks
    const incompleteTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    // Log tasks in the console for debugging with all their parameters
    console.log("Incomplete Tasks:", incompleteTasks);
    incompleteTasks.forEach(task => console.log(`ID: ${task.id}, Description: ${task.description}, Completed: ${task.completed}`));
    
    console.log("Completed Tasks:", completedTasks);
    completedTasks.forEach(task => console.log(`ID: ${task.id}, Description: ${task.description}, Completed: ${task.completed}`));

    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-task-list'); // Completed task list

    taskList.innerHTML = ''; // Clear current list
    completedTaskList.innerHTML = ''; // Clear completed list

    // Render incomplete tasks
    incompleteTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.description}</span>
            <button onclick="completeTask(${task.id}, ${task.completed})">
                ${task.completed ? 'Undo' : 'Complete'}
            </button>
            <button onclick="deleteTask(${task.id})">Delete</button>
            <button onclick="openUpdateModal(${task.id}, '${task.description}')">Update</button>
        `;
        taskList.appendChild(li); // Append to incomplete list
        console.log(`Appended to Incomplete Task List: ID: ${task.id}, Description: ${task.description}`); // Log the appended task
    });

    // Render completed tasks
    completedTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.description}</span>
            <button onclick="completeTask(${task.id}, ${task.completed})">Undo</button>
            <button onclick="deleteCompletedTask(${task.id})">Delete</button>
        `;
        completedTaskList.appendChild(li); // Append to completed list
        console.log(`Appended to Completed Task List: ID: ${task.id}, Description: ${task.description}`); // Log the appended task
    });
};

// Add a new task
const addTask = async () => {
    const description = document.getElementById('task-input').value;
    if (!description) return;

    await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
    });

    fetchTasks(); // Refresh the task list
};

// Complete or undo task completion
const completeTask = async (id, completed) => {
    console.log(`Toggling task with ID ${id}, currently completed: ${completed}`);

    await fetch(`/tasks/complete/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }) // Toggle completion status
    });

    fetchTasks(); // Refresh the task list
};

// Delete a single task
const deleteTask = async (id) => {
    console.log(`Deleting task with ID: ${id}`);

    await fetch(`/tasks/${id}`, { method: 'DELETE' });
    fetchTasks(); // Refresh the task list
};

// Delete a task from the completed list
const deleteCompletedTask = async (id) => {
    console.log(`Deleting completed task with ID: ${id}`);

    await fetch(`/tasks/${id}`, { method: 'DELETE' }); // Ensure this call uses the correct ID
    fetchTasks(); // Refresh the task list
};

// Clear all completed tasks
const clearCompletedTasks = async () => {
    console.log('Clearing all completed tasks...');

    await fetch('/tasks/completed', { method: 'DELETE' }); // Ensure we call the correct endpoint
    fetchTasks(); // Refresh the task list
};

// New: Open the update modal with the current task description
let currentTaskId = null; // Variable to store the ID of the task being updated

const openUpdateModal = (id, currentDescription) => {
    currentTaskId = id; // Set the current task ID
    document.getElementById('updateTaskInput').value = currentDescription; // Prefill the modal input with the current description
    document.getElementById('updateModal').style.display = 'block'; // Show the modal
};

// New: Close the update modal
const closeUpdateModal = () => {
    document.getElementById('updateModal').style.display = 'none'; // Hide the modal
};

// New: Save the updated task
const saveUpdatedTask = async () => {
    const updatedDescription = document.getElementById('updateTaskInput').value;
    if (!updatedDescription) return;

    await fetch(`/tasks/${currentTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: updatedDescription }) // Update task description
    });

    closeUpdateModal(); // Close the modal
    fetchTasks(); // Refresh the task list
};

// Load the tasks when the window loads
window.onload = fetchTasks;
