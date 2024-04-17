const DBversion = 6;
let englishAtTimeOfTranslation;
let frenchAtTimeOfTranslation;

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
            console.log("button clicked!");
            saveTranslation();
        });

        saveFrenchBtn.addEventListener('click', function () {
            console.log("button clicked!");
            saveTranslation();
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

    }
    if (document.getElementById('savedPageIdentifier')) {
        console.log("savedPage");

        initializeDB();

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
                fetch('http://10.150.3.55:3000/search-entries', {
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
    function saveTranslation() {

        const trimmedEnglish = englishAtTimeOfTranslation.trim().toLowerCase();  // Normalize and trim the English text
        const trimmedFrench = frenchAtTimeOfTranslation.trim();  // Trim the French text to remove any leading or trailing whitespace
        const type = trimmedEnglish.includes(' ') ? 'phrases' : 'words';  // Determine the type based on trimmed text

        const dbRequest = indexedDB.open("EnParlantDB", DBversion);
        dbRequest.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction([type], 'readwrite');
            const store = transaction.objectStore(type);

            const getRequest = store.get(englishAtTimeOfTranslation.toLowerCase());
            getRequest.onsuccess = function () {
                if (!getRequest.result) { // If it does not exist, add it
                    store.add({
                        english: englishAtTimeOfTranslation.toLowerCase(),
                        french: frenchAtTimeOfTranslation
                    }).onsuccess = function () {
                        console.log('Translation saved successfully');
                    };
                    store.onerror = function (e) {
                        console.error('Failed to save translation', e.target.error);
                    };
                } else {
                    console.log('This translation already exists in the dictionary.');
                }
            };
        };
        dbRequest.onerror = function (e) {
            console.error("Database error: ", e.target.error);
        };
    }




    // Function to perform the translation
    function translateText(text, targetLang, outputTextArea, saveButton) {
        text = text.trim();  // Trim the text to remove any leading or trailing whitespace
        if (text === '') {
            alert('Please enter text to translate.');
            return;
        }

        fetch('http://10.150.3.55:3000/translate', {
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

                // Update the translation time variables
                if (targetLang === 'fr') {
                    englishAtTimeOfTranslation = text;
                    frenchAtTimeOfTranslation = data.translations[0].text;
                } else {
                    englishAtTimeOfTranslation = data.translations[0].text;
                    frenchAtTimeOfTranslation = text;
                }

                checkIfSaved(saveButton);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Translation failed. Please try again.');
            });
    }

    // Function to check if the translation exists and update the button
    // This function checks if the translation already exists in the database and updates the save button accordingly.
    function checkIfSaved(saveButton) {
        const dbRequest = indexedDB.open("EnParlantDB", DBversion);
        dbRequest.onsuccess = function (event) {
            const db = event.target.result;
            const storeType = englishAtTimeOfTranslation.includes(' ') ? 'phrases' : 'words';
            const transaction = db.transaction([storeType], 'readonly');
            const store = transaction.objectStore(storeType);
            const lowerCaseEnglish = englishAtTimeOfTranslation.toLowerCase();

            const getRequest = store.get(lowerCaseEnglish);
            getRequest.onsuccess = () => {
                if (getRequest.result) {
                    saveButton.textContent = 'Saved';
                    saveButton.disabled = true;
                } else {
                    saveButton.textContent = `Save ${storeType === 'words' ? 'English' : 'French'}`;
                    saveButton.disabled = false;
                    saveButton.onclick = () => {
                        saveTranslation(lowerCaseEnglish, frenchAtTimeOfTranslation, storeType);
                        saveButton.textContent = 'Saved';
                        saveButton.disabled = true;
                    };
                }
            };
        };
        dbRequest.onerror = function (e) {
            console.error("Database error: ", e.target.error);
        };
    }



    function createTranslationItem(english, french) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('translation-item');

        const englishDiv = document.createElement('div');
        englishDiv.classList.add('english-text');
        englishDiv.textContent = english;

        const frenchDiv = document.createElement('div');
        frenchDiv.classList.add('french-text');
        frenchDiv.textContent = french;

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fas', 'fa-times', 'delete-icon');
        deleteIcon.onclick = function () {
            deleteTranslation(english, itemDiv, english.includes(' ') ? 'phrases' : 'words');
        };

        // Append the text divs first, then the delete icon to ensure it appears on the right
        itemDiv.appendChild(englishDiv);
        itemDiv.appendChild(frenchDiv);
        itemDiv.appendChild(deleteIcon);

        return itemDiv;
    }

    // Enhanced Function to delete a translation from the database and remove the item div
    function deleteTranslation(english, itemDiv, type) {
        const dbRequest = indexedDB.open("EnParlantDB", DBversion);
        dbRequest.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction([type], 'readwrite');
            const store = transaction.objectStore(type);

            store.delete(english.toLowerCase()).onsuccess = function () {
                console.log('Translation deleted successfully');
                // Remove the item div directly instead of fetching and displaying all items again
                itemDiv.remove();
            };
        };
        dbRequest.onerror = function (e) {
            console.error("Database error: ", e.target.error);
        };
    }


    // Function to fetch and display words
    function fetchAndDisplayWords() {
        const dbRequest = window.indexedDB.open("EnParlantDB");

        dbRequest.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(["words"], "readonly");
            const store = transaction.objectStore("words");
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = function () {
                const wordsList = document.getElementById('wordsList');
                wordsList.innerHTML = ''; // Clear existing content
                getAllRequest.result.forEach(word => {
                    const itemDiv = createTranslationItem(word.english, word.french);
                    wordsList.appendChild(itemDiv);
                });
            };
        };
    }

    // Function to fetch and display phrases
    function fetchAndDisplayPhrases() {
        const dbRequest = window.indexedDB.open("EnParlantDB");

        dbRequest.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(["phrases"], "readonly");
            const store = transaction.objectStore("phrases");
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = function () {
                const phrasesList = document.getElementById('phrasesList');
                phrasesList.innerHTML = ''; // Clear existing content
                getAllRequest.result.forEach(phrase => {
                    const itemDiv = createTranslationItem(phrase.english, phrase.french);
                    phrasesList.appendChild(itemDiv);
                });
            };
        };
    }


    function initializeDB() {
        let db;
        const request = window.indexedDB.open("EnParlantDB", DBversion);
        console.log("DB stuff happening!");

        request.onerror = function (event) {
            console.error("Database error: " + event.target.errorCode);
        };

        request.onupgradeneeded = function (event) {

            console.log("upgrade happening!");

            const db = event.target.result;

            // Create an object store for 'words' if it doesn't exist, keyed by the English word
            if (!db.objectStoreNames.contains('words')) {
                const wordStore = db.createObjectStore('words', { keyPath: 'english' });
                console.log('Words store created successfully.');
            }

            // Create an object store for 'phrases' if it doesn't exist, keyed by the English phrase
            if (!db.objectStoreNames.contains('phrases')) {
                const phraseStore = db.createObjectStore('phrases', { keyPath: 'english' });
                console.log('Phrases store created successfully.');
            }
        };

        request.onsuccess = function (event) {
            db = event.target.result;
            console.log("Database initialized - connected to IndexedDB.");
        };
    }

    function destroyTables() {
        // Open the database; increase the version to trigger onupgradeneeded
        const dbRequest = indexedDB.open("EnParlantDB", DBversion); // Increment the version number as necessary

        dbRequest.onupgradeneeded = function (event) {
            const db = event.target.result;

            // Delete the 'words' object store if it exists
            if (db.objectStoreNames.contains('words')) {
                db.deleteObjectStore('words');
                console.log('Words table deleted successfully.');
            }

            // Delete the 'phrases' object store if it exists
            if (db.objectStoreNames.contains('phrases')) {
                db.deleteObjectStore('phrases');
                console.log('Phrases table deleted successfully.');
            }

            // Delete the 'translations' object store if it exists
            if (db.objectStoreNames.contains('translations')) {
                db.deleteObjectStore('translations');
                console.log('Translations table deleted successfully.');
            }
        };

        dbRequest.onsuccess = function (event) {
            console.log('Database updated successfully.');
        };

        dbRequest.onerror = function (event) {
            console.error('Error updating database:', event.target.errorCode);
        };
    }


});
