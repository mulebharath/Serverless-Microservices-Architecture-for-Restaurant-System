const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); 

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

// Menu price map
const MENU_PRICES = {
  "Masala Dosa": 120,
  "Dal Makhani": 180,
  "Samosa": 40,
  "Gulab Jamun": 70,
  "Palak Paneer": 260,
  "Fish Curry": 350,
  "Dhokla": 80,
  "Veg Hakka Noodles": 180,
  "Chicken Manchurian": 220,
  "Spring Rolls": 150,
  "Schezwan Fried Rice": 200,
  "Chilli Paneer": 210,
  "Hot & Sour Soup": 120,
  "Chicken Lollipop": 240,
  "Momos": 130,
  "Kung Pao Chicken": 260,
  "Crispy Chilli Potato": 160,
  "Margherita Pizza": 350,
  "Pasta Alfredo": 320,
  "Bruschetta": 180,
  "Tiramisu": 220,
  "Lasagna": 340,
  "Risotto": 300,
  "Pesto Pasta": 280,
  "Focaccia": 150,
  "Minestrone Soup": 140,
  "Caprese Salad": 160,
  "Cheeseburger": 280,
  "French Fries": 120,
  "BBQ Chicken Wings": 260,
  "Chocolate Brownie": 150,
  "Mango Lassi": 90,
  "Hot Dog": 180,
  "Mac and Cheese": 200,
  "Caesar Salad": 160,
  "Apple Pie": 140,
  "Pancakes": 120
};

// Setup SQLite database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Failed to create in-memory SQLite database:', err);
        process.exit(1);
    }
    console.log('Connected to in-memory SQLite database.');
});

// Initialize the database table with price
// (If you restart the server, all orders will be lost, but this is for demo)
db.serialize(() => {
    db.run("CREATE TABLE orders (id INTEGER PRIMARY KEY, item TEXT, quantity INTEGER, price INTEGER)");
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Routes
app.get('/orders', (req, res) => {
    db.all("SELECT * FROM orders", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/orders', (req, res) => {
    const { item, quantity } = req.body;
    const price = MENU_PRICES[item] || 100; // fallback price
    db.run("INSERT INTO orders (item, quantity, price) VALUES (?, ?, ?)", [item, quantity, price], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, item, quantity, price });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`OrderService listening on http://localhost:${PORT}`);
});
