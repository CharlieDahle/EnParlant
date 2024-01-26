document.getElementById('translateBtn').addEventListener('click', function () {
    const textToTranslate = document.getElementById('textToTranslate').value;
    fetch('YOUR_SERVER_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToTranslate }),
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('translationResult').textContent = data.translatedText;
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
