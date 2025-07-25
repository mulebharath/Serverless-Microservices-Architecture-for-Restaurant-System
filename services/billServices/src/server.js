const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3003;

// Use file-based DB to persist data
const db = new sqlite3.Database('./billing.db', (err) => {
    if (err) {
        console.error('Failed to open SQLite database:', err);
        process.exit(1);
    }
    console.log('Connected to SQLite database.');
});

// Initialize table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS bills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        amount REAL NOT NULL
    )`);
});

// POST /billing with validation and error handling
app.post('/billing', (req, res) => {
    const { order_id, amount } = req.body;

    // Validate input
    if (typeof order_id !== 'number' || order_id <= 0) {
        return res.status(400).json({ error: 'Invalid or missing order_id (must be a positive number)' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Invalid or missing amount (must be a positive number)' });
    }

    db.run("INSERT INTO bills (order_id, amount) VALUES (?, ?)", [order_id, amount], function(err) {
        if (err) {
            console.error('Error inserting bill:', err);
            return res.status(500).json({ error: 'Database error while creating bill' });
        }
        res.json({ id: this.lastID, order_id, amount });
    });
});

// GET /billing returns all bills
app.get('/billing', (req, res) => {
    db.all("SELECT * FROM bills", [], (err, rows) => {
        if (err) {
            console.error('Error querying bills:', err);
            return res.status(500).json({ error: 'Database error while fetching bills' });
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`BillingService listening on http://localhost:${PORT}`);
});
