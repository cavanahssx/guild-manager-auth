const axios = require('axios');

const SHEET_ID = '10MIBLqbYN9DUi5uEgaOH8xRkj6agJxwBeBzh--lVg_w'; // Remplace par ton ID Google Sheets
const API_KEY = process.env.GOOGLE_API_KEY;

async function addUserToSheet(user) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Players!A:D:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

    const values = [
        [user.id, user.username, user.discriminator, new Date().toLocaleString()]
    ];

    const body = { values };

    try {
        const response = await axios.post(url, body, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(`Utilisateur ${user.username} ajouté.`);
    } catch (error) {
        console.error("Erreur lors de l'ajout à Google Sheets :", error.response.data);
    }
}

module.exports = { addUserToSheet };
