const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./monologues.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create the monologues table
db.run(`
    CREATE TABLE IF NOT EXISTS monologues (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT,
        category TEXT,
        description TEXT,
        era TEXT,
        play_name TEXT NOT NULL,
        full_text TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('Monologues table created.');
    }
});

// Create the favorites table
db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
        user_id INTEGER,
        monologue_id INTEGER,
        PRIMARY KEY (user_id, monologue_id),
        FOREIGN KEY (monologue_id) REFERENCES monologues(id)
    )
`, (err) => {
    if (err) {
        console.error('Error creating favorites table:', err.message);
    } else {
        console.log('Favorites table created.');
    }
});

// ✅ Define example monologues (now includes era and play_name!)
const monologues = [
    {
        title: "Hamlet's Soliloquy",
        author: 'William Shakespeare',
        category: 'Drama',
        description: "A famous soliloquy reflecting on life and death.",
        era: 'Classical',
        play_name: 'Hamlet',
        full_text: "To be, or not to be, that is the question..."
    },
    {
        title: "Shylock's Speech",
        author: 'William Shakespeare',
        category: 'Drama',
        description: "A powerful speech about prejudice and justice.",
        era: 'Classical',
        play_name: 'The Merchant of Venice',
        full_text: "Hath not a Jew eyes? Hath not a Jew hands, organs, dimensions..."
    },
    {
        title: "Modern Rant",
        author: 'Jordan E. Cooper',
        category: 'Comedy',
        description: "A passionate, funny speech from a recent play.",
        era: 'Contemporary',
        play_name: 'Ain’t No Mo’',
        full_text: "I’m tired of the flight delays and the emotional baggage fees..."
    }
];

// ✅ Insert monologues into the database
monologues.forEach(({ title, author, category, description, era, play_name, full_text }) => {
    db.run(`
        INSERT INTO monologues (title, author, category, description, era, play_name, full_text)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [title, author, category, description, era, play_name, full_text], (err) => {
        if (err) {
            console.error('Error inserting monologue:', err.message);
        } else {
            console.log(`Inserted monologue: ${title}`);
        }
    });
});

// Close DB connection after short delay to ensure inserts finish
setTimeout(() => db.close(), 500);
