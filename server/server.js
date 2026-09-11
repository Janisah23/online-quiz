require ('dotenv').config()
const express = require('express')
const cors = require('cors')

const db = require('./database/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});
 
app.get('/api/quizzes', (req, res) => {
    const quizzes = db.prepare('SELECT id, title, description FROM quizzes ORDER BY id').all();
    res.json(quizzes);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});