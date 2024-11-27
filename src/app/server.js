const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Reemplaza con tus credenciales de Spotify
const CLIENT_ID = 'TU_CLIENT_ID';
const CLIENT_SECRET = 'TU_CLIENT_SECRET';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

let accessToken = '';

// Función para obtener el token de acceso de Spotify
async function getAccessToken() {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'client_credentials'
      },
      headers: {
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    accessToken = response.data.access_token;
  } catch (error) {
    console.error('Error al obtener el token de acceso:', error);
  }
}

// Llama a la función para obtener el token al iniciar el servidor
getAccessToken();

// Endpoint para obtener recomendaciones
app.get('/recommendations', async (req, res) => {
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/browse/featured-playlists`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener recomendaciones:', error);
    res.status(500).send('Error al obtener recomendaciones');
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
