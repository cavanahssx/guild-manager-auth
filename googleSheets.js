const axios = require('axios');

const SHEET_ID = '10MIBLqbYN9DUi5uEgaOH8xRkj6agJxwBeBzh--lVg_w'; // Remplace par ton ID Google Sheets
const { GoogleSpreadsheet } = require('google-spreadsheet');

async function addUserToSheet(user) {
    try {
        const doc = new GoogleSpreadsheet(SHEET_ID);
        await doc.useServiceAccountAuth(JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON));
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0]; // Onglet "Players"
        await sheet.addRow({
            "ID Discord": user.id,
            "Pseudo": user.username,
            "Tag": user.discriminator,
            "Date Inscription": new Date().toLocaleString()
        });

        console.log(`Utilisateur ${user.username} ajouté.`);
    } catch (error) {
        console.error("Erreur lors de l'ajout à Google Sheets :", error);
    }
}

module.exports = { addUserToSheet };
