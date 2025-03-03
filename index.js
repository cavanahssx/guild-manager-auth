require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// URL OAuth2
const DISCORD_OAUTH2_URL = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=identify%20guilds.members.read`;

// Redirection vers Discord pour l'authentification
const { addUserToSheet } = require('./googleSheets');

app.get('/auth/discord/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send("Code manquant");

    try {
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
        }).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const user = userResponse.data;

        // Ajouter l'utilisateur à Google Sheets
        await addUserToSheet(user);

        res.send(`Bienvenue ${user.username}#${user.discriminator} ! Ton ID Discord est ${user.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de l'authentification");
    }
});


// Redirection vers Discord pour l'authentification
app.get('/auth/discord', (req, res) => {
    res.redirect(DISCORD_OAUTH2_URL);
});

// Callback après connexion Discord
app.get('/auth/discord/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send("Code manquant");

    try {
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
        }).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const user = userResponse.data;

        res.send(`Bienvenue ${user.username}#${user.discriminator} ! Ton ID Discord est ${user.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de l'authentification");
    }
});

app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
