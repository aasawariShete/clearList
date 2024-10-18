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
            <button onclick="completeTask(${task.id}, ${task.completed})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
</svg></button>
            <button onclick="deleteTask(${task.id})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg></button>
            <button onclick="openUpdateModal(${task.id}, '${task.description}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg></button>
        `;
        taskList.appendChild(li); // Append to incomplete list
        console.log(`Appended to Incomplete Task List: ID: ${task.id}, Description: ${task.description}`); // Log the appended task
    });

    // Render completed tasks
    completedTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.description}</span>
            <button onclick="completeTask(${task.id}, ${task.completed})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
  <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
</svg></button>
            <button onclick="deleteCompletedTask(${task.id})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg></button>
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
