document.addEventListener('DOMContentLoaded', function () {

    const backArrow = document.getElementById('backArrow');
    if (backArrow) {
        backArrow.addEventListener('click', function () {
            window.location.href = 'homepage.html'; // Change the current page to homepage.html
        });
    }


    const englishTextArea = document.getElementById('englishText');
    const frenchTextArea = document.getElementById('frenchText');
    const translateToEnglishBtn = document.getElementById('translateToEnglish');
    const translateToFrenchBtn = document.getElementById('translateToFrench');

    // Function to handle translation from English to French
    translateToFrenchBtn.addEventListener('click', function () {
        const textToTranslate = englishTextArea.value;
        const targetLang = 'fr'; // French language code

        translateText(textToTranslate, targetLang, frenchTextArea);
    });

    // Function to handle translation from French to English
    translateToEnglishBtn.addEventListener('click', function () {
        const textToTranslate = frenchTextArea.value;
        const targetLang = 'en'; // English language code

        translateText(textToTranslate, targetLang, englishTextArea);
    });

    // Function to perform the translation
    function translateText(text, targetLang, outputTextArea) {
        console.log(text + " " + targetLang);
        if (text.trim() === '') {
            alert('Please enter text to translate.');
            return;
        }

        fetch('http://localhost:3000/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text, targetLang: targetLang }),
        })
            .then(response => response.json())
            .then(data => {
                outputTextArea.value = data.translations[0].text;
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Translation failed. Please try again.');
            });
    }
});
