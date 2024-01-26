const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use the environment's port if available, or default to 3000

app.use(express.json()); // Middleware to parse JSON bodies

// Basic test route
app.get('/', (req, res) => {
    res.send('En Parlant server is running!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

const fetch = require('node-fetch'); // You might need to run `npm install node-fetch` if you haven't already

app.post('/translate', async (req, res) => {
    const { text, targetLang } = req.body;
    const deepLApiKey = 'YOUR_DEEPL_API_KEY'; // Replace with your actual DeepL API key

    try {
        const response = await fetch('https://api.deepl.com/v2/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `DeepL-Auth-Key ${deepLApiKey}`
            },
            body: new URLSearchParams({ text, target_lang: targetLang })
        });

        if (!response.ok) {
            throw new Error('Failed to translate text');
        }

        const data = await response.json();
        res.json(data); // Send the translation data back to the extension
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).send('Server error during translation');
    }
});

