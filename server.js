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
  user: 'root', // Replace with your MySQL user (typically "root" in XAMPP)
  password: '', // Leave blank if you don't have a MySQL password
  database: 'todo_db' // Use the database created in phpMyAdmin
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// CRUD operations for the To-Do app

// CREATE a new task
app.post('/tasks', (req, res) => {
  const { description } = req.body;
  const sql = 'INSERT INTO tasks (description) VALUES (?)';
  db.query(sql, [description], (err, result) => {
    if (err) {
      res.status(500).send('Error adding task');
      return;
    }
    res.status(201).send({ id: result.insertId, description });
  });
});

// READ all tasks
app.get('/tasks', (req, res) => {
  const sql = 'SELECT * FROM tasks ORDER BY completed, id';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching tasks');
      return;
    }
    res.send(results);
  });
});

// UPDATE task (mark as complete)
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const sql = 'UPDATE tasks SET completed = ? WHERE id = ?';
  db.query(sql, [completed, id], (err) => {
    if (err) {
      res.status(500).send('Error updating task');
      return;
    }
    res.send({ message: 'Task updated' });
  });
});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
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
