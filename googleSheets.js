const axios = require('axios');

const SHEET_ID = '10MIBLqbYN9DUi5uEgaOH8xRkj6agJxwBeBzh--lVg_w'; // Remplace par ton ID Google Sheets
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { GoogleAuth } = require('google-auth-library');

async function addUserToSheet(user) {
    try {
        const auth = new GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const doc = new GoogleSpreadsheet(SHEET_ID, auth);
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0]; // Premier onglet de la feuille
        await sheet.addRow({
            "ID Discord": user.id,
            "Pseudo": user.username,
            "Tag": user.discriminator,
            "Date Inscription": new Date().toLocaleString()
        });

        console.log(`✅ Utilisateur ajouté : ${user.username}`);
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout à Google Sheets :", error);
    }
}

module.exports = { addUserToSheet };
