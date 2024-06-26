const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000; // Use the environment's port if available, or default to 3000
require('dotenv').config();


const cors = require('cors');
app.use(cors());



app.use(express.json()); // Middleware to parse JSON bodies

// Basic test route
app.get('/', (req, res) => {
    res.send('En Parlant server is running!');
});



// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// Translation Endpoint

app.post('/translate', async (req, res) => {

    const { text, targetLang } = req.body;
    console.log("User translating: " + text + " into " + targetLang);
    const apiKey = process.env.DEEPL_API_KEY;
    const url = 'https://api-free.deepl.com/v2/translate';
    const data = new URLSearchParams({ text, target_lang: targetLang }).toString();

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `DeepL-Auth-Key ${apiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error during translation');
    }
});

// save
app.post('/save', async (req, res) => {

    const { english, french, type } = req.body; // Expecting English and French text, and type ('word' or 'phrase')

    const table = type === 'word' ? 'Words' : 'Phrases';

    // First, check if the English text already exists in the table
    const checkSql = `SELECT * FROM ${table} WHERE english = ?`;

    db.get(checkSql, [english], (err, row) => {
        if (err) {
            res.status(500).send('Error checking for duplicates');
            console.error(err.message);
            return;
        }

        // If the word/phrase already exists, don't insert a new record
        if (row) {
            res.send({ message: 'This translation already exists in the dictionary.' });
            return;
        }

        // If it doesn't exist, insert the new word/phrase
        const insertSql = `INSERT INTO ${table} (english, french) VALUES (?, ?)`;

        db.run(insertSql, [english, french], function (err) {
            if (err) {
                res.status(500).send('Failed to save translation');
                console.error(err.message);
            } else {
                console.log(`A new row has been inserted into the ${table} table with ID ${this.lastID}.`);
                res.send({ message: 'Translation saved successfully', id: this.lastID });
            }
        });
    });
});


// Endpoint to fetch all words
app.get('/words', (req, res) => {
    const sql = 'SELECT * FROM Words';

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).send('Error fetching words');
            console.error(err.message);
        } else {
            res.json(rows);
        }
    });
});

// Endpoint to fetch all phrases
app.get('/phrases', (req, res) => {
    const sql = 'SELECT * FROM Phrases';

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).send('Error fetching phrases');
            console.error(err.message);
        } else {
            res.json(rows);
        }
    });
});

app.post('/search-entries', async (req, res) => {


    console.log("Using lexicala!");


    const { text, language } = req.body;
    console.log("Text: " + text);
    const options = {
        method: 'GET',
        url: 'https://lexicala1.p.rapidapi.com/search-entries',
        params: { text, language },
        headers: {
            'x-rapidapi-key': '169fd5711cmsh1a353972168f10ap16b1fcjsna2ee5d6356cc', // not hidden because its a general key. NOT personal
            'x-rapidapi-host': 'lexicala1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching word definition');
    }
});



