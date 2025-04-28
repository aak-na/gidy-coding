// Import required packages
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',        // Your MySQL host
  user: 'root',              // Your MySQL username
  password: 'Aakash',        // Your MySQL password
  database: 'feedbackDB'     // Your MySQL database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('❌ Could not connect to MySQL:', err);
  } else {
    console.log('✅ MySQL connected successfully');
  }
});

// POST route to save feedback
app.post('/feedback', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please provide name, email, and message' });
  }

  const query = 'INSERT INTO feedbacks (name, email, message) VALUES (?, ?, ?)';
  db.query(query, [name, email, message], (err, result) => {
    if (err) {
      console.error('❌ Error inserting feedback:', err);
      res.status(500).json({ message: 'Error saving feedback' });
    } else {
      res.json({ message: '✅ Feedback saved successfully!' });
    }
  });
});

// GET route to fetch all feedbacks (Admin view)
app.get('/feedbacks', (req, res) => {
  const query = 'SELECT * FROM feedbacks';
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching feedbacks:', err);
      res.status(500).json({ message: 'Error fetching feedbacks' });
    } else {
      res.json(results);
    }
  });
});


// Delete feedback
app.delete('/feedback/:id', (req, res) => {
  const feedbackId = req.params.id;

  const query = 'DELETE FROM feedbacks WHERE id = ?';
  db.query(query, [feedbackId], (err, result) => {
    if (err) {
      console.error('❌ Error deleting feedback:', err);
      return res.status(500).json({ success: false, message: 'Error deleting feedback' });
    }

    if (result.affectedRows > 0) {
      return res.json({ success: true, message: '✅ Feedback deleted successfully' });
    } else {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
  });
});

// Update feedback
app.put('/feedback/:id', (req, res) => {
  const feedbackId = req.params.id;
  const { message } = req.body;  // Only the message is being updated

  // SQL query to update the feedback message
  const query = 'UPDATE feedbacks SET message = ? WHERE id = ?';
  db.query(query, [message, feedbackId], (err, result) => {
    if (err) {
      console.error('❌ Error updating feedback:', err);
      res.status(500).json({ success: false, message: 'Error updating feedback' });
    } else {
      if (result.affectedRows > 0) {
        res.json({ success: true, message: '✅ Feedback updated successfully' });
      } else {
        res.status(404).json({ success: false, message: 'Feedback not found' });
      }
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


