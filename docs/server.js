const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the current directory (including HTML, CSS, JS)
app.use(express.static(__dirname)); 

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const db = new sqlite3.Database('./monologues.db');

// Get all monologues
app.get('/api/monologues', (req, res) => {
    db.all('SELECT * FROM monologues', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get one monologue by ID
app.get('/api/monologues/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM monologues WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

// Add a new monologue
app.post('/api/monologues', (req, res) => {
    const { title, author, category, description, full_text, era, play_name } = req.body;

    if (!title || !author || !category || !description || !full_text || !era || !play_name) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    db.run(
        'INSERT INTO monologues (title, author, category, description, full_text, era, play_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, author, category, description, full_text, era, play_name],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({
                id: this.lastID,
                title,
                author,
                category,
                description,
                full_text,
                era,
                play_name
            });
        }
    );
});

// Get all favorites for a user
app.get('/api/favorites/:userId', (req, res) => {
    const userId = req.params.userId;
    db.all(
        'SELECT m.* FROM monologues m JOIN favorites f ON m.id = f.monologue_id WHERE f.user_id = ?',
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

// Add a monologue to favorites
app.post('/api/favorites', (req, res) => {
    const { user_id, monologue_id } = req.body;
    db.run(
        'INSERT INTO favorites (user_id, monologue_id) VALUES (?, ?)',
        [user_id, monologue_id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Favorite added', id: this.lastID });
        }
    );
});

// Remove a monologue from favorites
app.post('/api/favorites/remove', (req, res) => {
    const { user_id, monologue_id } = req.body;
    db.run(
        'DELETE FROM favorites WHERE user_id = ? AND monologue_id = ?',
        [user_id, monologue_id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Favorite removed' });
        }
    );
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
