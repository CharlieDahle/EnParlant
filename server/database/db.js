const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('enParlant.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the enParlant database.');
    }
});

db.serialize(() => {
    // Drop old tables if they exist
    db.run('DROP TABLE IF EXISTS englishWords');
    db.run('DROP TABLE IF EXISTS frenchWords');

    // Create new tables for Words and Phrases
    db.run(`CREATE TABLE Words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        english TEXT NOT NULL,
        french TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE Phrases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        english TEXT NOT NULL,
        french TEXT NOT NULL
    )`);
});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Closed the database connection.');
    }
});
