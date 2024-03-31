document.addEventListener('DOMContentLoaded', function () {

    if (document.getElementById('translatePageIdentifier')) {
        console.log("this is the translate page!");
        const translateBackArrow = document.getElementById('translate_backArrow');
        const englishTextArea = document.getElementById('englishText');
        const frenchTextArea = document.getElementById('frenchText');
        const translateToEnglishBtn = document.getElementById('translateToEnglish');
        const translateToFrenchBtn = document.getElementById('translateToFrench');
        const saveEnglishBtn = document.getElementById('saveEnglishText');
        const saveFrenchBtn = document.getElementById('saveFrenchText');

        saveEnglishBtn.style.display = 'none';
        saveFrenchBtn.style.display = 'none';


        if (translateBackArrow) {

            translateBackArrow.addEventListener('click', function () {
                window.location.href = 'homepage.html';
            });
        }

        saveEnglishBtn.addEventListener('click', function () {
            saveTranslation(englishTextArea.value, frenchTextArea.value);
        });

        saveFrenchBtn.addEventListener('click', function () {
            saveTranslation(englishTextArea.value, frenchTextArea.value);
        });

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

        // setupTranslatePage();

    } if (document.getElementById('savedPageIdentifier')) {
        console.log("savedPage");

        const savedBackArrow = document.getElementById('saved_backArrow');

        fetchAndDisplayWords();
        fetchAndDisplayPhrases();

        // Setup tab switching functionality
        const wordsTab = document.getElementById('wordsTab');
        const phrasesTab = document.getElementById('phrasesTab');
        const wordsContainer = document.getElementById('wordsContainer');
        const phrasesContainer = document.getElementById('phrasesContainer');

        wordsTab.addEventListener('click', function () {
            wordsContainer.classList.add('active');
            phrasesContainer.classList.remove('active');
            wordsTab.classList.add('active');
            phrasesTab.classList.remove('active');
        });

        phrasesTab.addEventListener('click', function () {
            phrasesContainer.classList.add('active');
            wordsContainer.classList.remove('active');
            phrasesTab.classList.add('active');
            wordsTab.classList.remove('active');
        });

        if (savedBackArrow) {
            console.log('Adding event listener to saved back arrow');
            savedBackArrow.addEventListener('click', function () {
                window.location.href = 'homepage.html';
            });
        }
    }
    if (document.getElementById('dictionaryPageIdentifier')) {
        console.log("dictionary dawg come on!");

        const dictionary_backArrow = document.getElementById('dictionary_backArrow');

        if (dictionary_backArrow) {
            console.log('Adding event listener to dictionary back arrow');
            dictionary_backArrow.addEventListener('click', function () {
                window.location.href = 'homepage.html';
            });
        }

        document.getElementById('searchButton').addEventListener('click', function () {
            const text = document.getElementById('wordInput').value.trim(); // Assuming 'wordInput' is the ID of your input field
            const language = 'fr'; // For now, we're hardcoding this, but you can make it dynamic based on your needs

            if (text) {
                fetch('http://localhost:3000/search-entries', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: text, language: language })
                })
                    .then(response => response.json())
                    .then(data => {
                        const definitionContainer = document.getElementById('definitionContainer');
                        definitionContainer.innerHTML = ''; // Clear previous content

                        if (data.results && data.results.length > 0) {
                            data.results.forEach(item => {
                                const entryDiv = document.createElement('div');
                                entryDiv.classList.add('dictionary-entry');

                                const headword = document.createElement('h3');
                                headword.textContent = `${item.headword.text} (${item.headword.pos})`;
                                entryDiv.appendChild(headword);

                                item.senses.forEach(subitem => {
                                    const definition = document.createElement('p');
                                    definition.textContent = `Definition: ${subitem.definition}`;
                                    entryDiv.appendChild(definition);

                                    if (subitem.synonyms && subitem.synonyms.length > 0) {
                                        const synonyms = document.createElement('p');
                                        synonyms.textContent = 'Synonyms: ' + subitem.synonyms.join(', ');
                                        entryDiv.appendChild(synonyms);
                                    }
                                });

                                definitionContainer.appendChild(entryDiv);
                            });
                        } else {
                            definitionContainer.textContent = 'No results found.';
                        }
                    })
                    .catch(error => console.error('Error:', error));
            }
        });
    }


    if (document.getElementById('homePageIdentifier')) {
        console.log("home page!");
        // does not get here!
    }

    function isWord(text) {
        return !text.includes(' ');
    }

    // Function to save the translation to the database
    function saveTranslation(englishText, frenchText) {
        const type = isWord(englishText.trim()) ? 'word' : 'phrase';

        console.log(`Saving translation: ${englishText} (EN) | ${frenchText} (FR) as a ${type}`);

        fetch('http://localhost:3000/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                english: englishText,
                french: frenchText,
                type: type
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                alert('Translation saved successfully');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to save translation. Please try again.');
            });
    }

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

    // Function to create and return a translation item div
    function createTranslationItem(english, french) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('translation-item');

        const englishDiv = document.createElement('div');
        englishDiv.classList.add('english-text');
        englishDiv.textContent = english;

        const frenchDiv = document.createElement('div');
        frenchDiv.classList.add('french-text');
        frenchDiv.textContent = french;

        itemDiv.appendChild(englishDiv);
        itemDiv.appendChild(frenchDiv);

        return itemDiv;
    }

    // Function to fetch and display words
    function fetchAndDisplayWords() {
        fetch('http://localhost:3000/words')
            .then(response => response.json())
            .then(words => {
                const wordsList = document.getElementById('wordsList');
                wordsList.innerHTML = ''; // Clear existing content
                words.forEach(word => {
                    const wordItem = createTranslationItem(word.english, word.french);
                    wordsList.appendChild(wordItem);
                });
            })
            .catch(error => console.error('Error fetching words:', error));
    }

    // Function to fetch and display phrases
    function fetchAndDisplayPhrases() {
        fetch('http://localhost:3000/phrases')
            .then(response => response.json())
            .then(phrases => {
                const phrasesList = document.getElementById('phrasesList');
                phrasesList.innerHTML = ''; // Clear existing content
                phrases.forEach(phrase => {
                    const phraseItem = createTranslationItem(phrase.english, phrase.french);
                    phrasesList.appendChild(phraseItem);
                });
            })
            .catch(error => console.error('Error fetching phrases:', error));
    }
});
