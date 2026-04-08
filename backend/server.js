const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware allows our frontend to communicate with our backend easily
app.use(cors());
app.use(express.json());

// API: Get all orders
app.get('/api/orders', (req, res) => {
    const sql = `SELECT * FROM orders ORDER BY createdAt DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ orders: rows });
    });
});

// API: Create a new order
app.post('/api/orders', (req, res) => {
    const { customerName, items } = req.body;
    
    if (!customerName || !items) {
        return res.status(400).json({ error: 'Customer name and items are required' });
    }

    // Default status is 'Preparing' 
    const sql = `INSERT INTO orders (customerName, items, status) VALUES (?, ?, 'Preparing')`;
    
    // Use function() instead of arrow function so we can access `this.lastID`
    db.run(sql, [customerName, items], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            id: this.lastID, 
            customerName, 
            items, 
            status: 'Preparing' 
        });
    });
});

// API: Update order status
app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Preparing', 'Ready', 'Completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be Preparing, Ready, or Completed.' });
    }

    const sql = `UPDATE orders SET status = ? WHERE id = ?`;
    
    db.run(sql, [status, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order status updated successfully' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
