const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');  

const app = express();
app.use(express.json());
app.use(cors());  

const PORT = 3002;


// Setup SQLite database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Failed to create in-memory SQLite database:', err);
        process.exit(1);
    }
    console.log('Connected to in-memory SQLite database.');
});

// Initialize the database table
db.serialize(() => {
    db.run("CREATE TABLE cooking_tasks (id INTEGER PRIMARY KEY, order_id INTEGER, status TEXT)");
});

// Routes
app.post('/cooking', (req, res) => {
    const { order_id } = req.body;
    db.run("INSERT INTO cooking_tasks (order_id, status) VALUES (?, ?)", [order_id, "Cooking"], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, order_id, status: "Cooking" });
    });
});

app.get('/cooking', (req, res) => {
    db.all("SELECT * FROM cooking_tasks", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`CookingService listening on http://localhost:${PORT}`);
});
