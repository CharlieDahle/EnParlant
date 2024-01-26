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

// Translation Endpoint

app.post('/translate', async (req, res) => {
    const { text, targetLang } = req.body;
    // Replace 'YOUR_DEEPL_API_KEY' with your actual DeepL API key
    const apiKey = 'YOUR_DEEPL_API_KEY';
    const url = `https://api.deepl.com/v2/translate`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `DeepL-Auth-Key ${apiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'text': text,
                'target_lang': targetLang
            })
        });

        if (!response.ok) throw new Error('Translation API call failed.');

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error during translation');
    }
});



