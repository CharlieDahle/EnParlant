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
    console.log(text);
    console.log(targetLang);
    const apiKey = 'fd1afbbb-abd2-c5e9-dc68-9d3c1ebf00ea:fx';
    const url = `https://api-free.deepl.com/v2/translate`;

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

        //console.log(response.json);


        if (!response.ok) throw new Error('Translation API call failed.');

        const data = await response.json();
        res.json(data);
        console.log(data);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error during translation');
    }
});

// Definition Endpoint
app.post('/define', async (req, res) => {
    const { word } = req.body;

    // Replace 'YOUR_DICTIONARY_API_URL' with the actual URL of the dictionary API
    // Replace 'YOUR_API_KEY' with your actual API key, if the API requires one
    const apiUrl = 'https://api.pons.com/v1/dictionary';
    const apiKey = '53e1be8517908a2b6146079069556ed45102c234543e894a1c5ebd2e40b6dc16';

    try {
        const url = `${apiUrl}?word=${encodeURIComponent(word)}&key=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch definition: ${response.statusText}`);
        }

        const data = await response.json();

        // Adapt this line based on the actual structure of your dictionary API's response
        res.json({ definition: data.definition });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching word definition');
    }
});


