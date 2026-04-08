const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

let db;
try {
    // Open a persistent database connection synchronously
    db = new Database(dbPath);
    console.log('Connected to the SQLite database.');

    // Create the orders table if it doesn't exist
    db.exec(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customerName TEXT NOT NULL,
            items TEXT NOT NULL,
            status TEXT DEFAULT 'Preparing',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('Orders table is ready.');
} catch (err) {
    console.error('Error connecting to or initializing SQLite database:', err.message);
}

module.exports = db;
