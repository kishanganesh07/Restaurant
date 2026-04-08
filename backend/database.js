const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

// Open a persistent database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create the orders table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customerName TEXT NOT NULL,
                items TEXT NOT NULL,
                status TEXT DEFAULT 'Preparing',
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Orders table is ready.');
            }
        });
    }
});

module.exports = db;
