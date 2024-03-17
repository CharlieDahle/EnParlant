document.addEventListener('DOMContentLoaded', function () {
    const backArrow = document.getElementById('backArrow');
    const englishTextArea = document.getElementById('englishText');
    const frenchTextArea = document.getElementById('frenchText');
    const translateToEnglishBtn = document.getElementById('translateToEnglish');
    const translateToFrenchBtn = document.getElementById('translateToFrench');
    const saveEnglishBtn = document.getElementById('saveEnglishText');
    const saveFrenchBtn = document.getElementById('saveFrenchText');

    // Initially hide the save buttons
    saveEnglishBtn.style.display = 'none';
    saveFrenchBtn.style.display = 'none';

    if (backArrow) {
        backArrow.addEventListener('click', function () {
            window.location.href = 'homepage.html';
        });
    }

    // Function to save text to the database
    function saveText(text, language) {
        fetch('http://localhost:3000/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text, language: language }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                alert('Text saved successfully');
                // Optionally, update the UI or disable the save button to indicate the text has been saved
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to save text. Please try again.');
            });
    }

    // Attach event listeners to "Save" buttons
    saveEnglishBtn.addEventListener('click', function () {
        saveText(englishTextArea.value, 'english');
    });

    saveFrenchBtn.addEventListener('click', function () {
        saveText(frenchTextArea.value, 'french');
    });

    // Function to perform the translation
    function translateText(text, targetLang, outputTextArea, saveButton) {
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
                outputTextArea.classList.add('non-edited'); // Indicate fresh translation with blue border
                saveButton.style.display = 'inline-block'; // Show the save button
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Translation failed. Please try again.');
            });
    }

    // Translation button event listeners
    translateToFrenchBtn.addEventListener('click', function () {
        translateText(englishTextArea.value, 'fr', frenchTextArea, saveFrenchBtn);
    });

    translateToEnglishBtn.addEventListener('click', function () {
        translateText(frenchTextArea.value, 'en', englishTextArea, saveEnglishBtn);
    });

    // Input event listeners for textareas to handle editing
    [englishTextArea, frenchTextArea].forEach(textArea => {
        textArea.addEventListener('input', () => {
            if (textArea.classList.contains('non-edited')) {
                textArea.classList.remove('non-edited'); // Remove indicator for fresh translation
                const saveBtn = textArea.id === 'englishText' ? saveEnglishBtn : saveFrenchBtn;
                saveBtn.style.display = 'none'; // Hide the save button as the text has been edited
            }
        });
    });
});
