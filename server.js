const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files from the public folder
app.use(express.static('public'));

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'todo_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// CREATE a new task
app.post('/tasks', (req, res) => {
  const { description } = req.body;
  const sql = 'INSERT INTO tasks (description) VALUES (?)';
  
  db.query(sql, [description], (err, result) => {
    if (err) {
      console.error('Error adding task:', err);
      res.status(500).send('Error adding task');
      return;
    }
    res.status(201).send({ id: result.insertId, description });
  });
});

// READ all tasks
app.get('/tasks', (req, res) => {
  console.log('Fetching all tasks...');
  const sql = 'SELECT * FROM tasks ORDER BY completed, id';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      res.status(500).send('Error fetching tasks');
      return;
    }
    res.send(results);
  });
});

// Toggle completion of a task
app.put('/tasks/complete/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  console.log(`Updating task ID ${id}, setting completed to: ${completed}`);

  const sql = 'UPDATE tasks SET completed = ? WHERE id = ?';
  db.query(sql, [completed, id], (err) => {
    if (err) {
      console.error('Error updating task:', err);
      res.status(500).send('Error updating task');
      return;
    }
    res.send({ message: 'Task status updated' });
  });
});

// UPDATE task description
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  console.log(`Updating task ID ${id} with description: ${description}`);

  const sql = 'UPDATE tasks SET description = ? WHERE id = ?';
  db.query(sql, [description, id], (err) => {
    if (err) {
      console.error('Error updating task:', err);
      res.status(500).send('Error updating task');
      return;
    }
    res.send({ message: 'Task updated successfully' });
  });
});

// DELETE all completed tasks
app.delete('/tasks/completed', (req, res) => {
  const sql = 'DELETE FROM tasks WHERE completed = ?';
  db.query(sql, [1], (err) => {
    if (err) {
      res.status(500).send('Error deleting completed tasks');
      return;
    }
    res.send({ message: 'All completed tasks deleted' });
  });
});
// Delete a single task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Deleting single task with ID: ${id}`);

  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      res.status(500).send('Error deleting task');
      return;
    }
    res.send({ message: 'Task deleted' });
  });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
