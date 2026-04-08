const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware allows our frontend to communicate with our backend easily
app.use(cors());
app.use(express.json());

// API: Get all orders
app.get('/api/orders', (req, res) => {
    try {
        const stmt = db.prepare(`SELECT * FROM orders ORDER BY createdAt DESC`);
        const rows = stmt.all();
        res.json({ orders: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Create a new order
app.post('/api/orders', (req, res) => {
    const { customerName, items } = req.body;
    
    if (!customerName || !items) {
        return res.status(400).json({ error: 'Customer name and items are required' });
    }

    try {
        const stmt = db.prepare(`INSERT INTO orders (customerName, items, status) VALUES (?, ?, 'Preparing')`);
        const info = stmt.run(customerName, items);
        
        res.status(201).json({ 
            id: info.lastInsertRowid, 
            customerName, 
            items, 
            status: 'Preparing' 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Update order status
app.put('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Preparing', 'Ready', 'Completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be Preparing, Ready, or Completed.' });
    }

    try {
        const stmt = db.prepare(`UPDATE orders SET status = ? WHERE id = ?`);
        const info = stmt.run(status, id);
        
        if (info.changes === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order status updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
