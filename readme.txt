"En Parlant" is a French-English Chrome extension designed to enhance
language learning and translation within the browser. It has three functionalities:

    1. facilitating quick translations 
    2. providing definitions / synonmys for words and phrases
    3. the ability to save words or phrases to easily access later

The extension uses HTML, CSS, and JavaScript for frontend interactions, Node.js
and Express for the backend server, and indexedDB for a client-side database. 
It integrates with DeepL's translation API and Lexicala's dictionary API.

Dependencies: 

    Node.js
    express
    axios 
    cors
    dotenv

Use instructions:

1. ensure you have node.js installed
2. run 'npm install' in the root directory
3. create .env file and add your personal "DEEPL_API_KEY"
4. run on local server using 'npm start'


Spring 2024 CS440 Capstone

*This project originally ran on a server provided by the University 
of Puget Sound's Technology Services. Since my graduation it has been 
changed to run on local host*