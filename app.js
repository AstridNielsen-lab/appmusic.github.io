const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const CLIENT_ID = 'd7bc5e84baff4e29955da145950147ab';
const CLIENT_SECRET = 'e47523c26d6144e48d006217ee6ce2e1';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'views' });
});

// Rota para obter recomendações
app.get('/api/recommendations', async (req, res) => {
  try {
    const bands = req.query.bands.split(','); // Use a lista completa de bandas

    // Autenticação para obter o token de acesso do Spotify
    const authResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'client_credentials',
      },
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET,
      },
    });

    const accessToken = authResponse.data.access_token;

    // Buscar informações sobre as bandas
    const bandInfoPromises = bands.map(async (band) => {
      const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: band,
          type: 'artist',
          limit: 10, // Ajuste para o número desejado de resultados
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const artists = searchResponse.data.artists.items;
      return artists.map((artist) => ({
        name: artist.name,
        genres: artist.genres,
        popularity: artist.popularity,
      }));
    });

    // Aguardar todas as promessas e enviar os resultados de volta para o front-end
    const bandInfoResults = (await Promise.all(bandInfoPromises)).flat().slice(0, 10);
    res.json(bandInfoResults);

  } catch (error) {
    console.error('Erro na busca de recomendações:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
