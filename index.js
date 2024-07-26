const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

const getHackerRankStats = async (username) => {
  try {
    const { data } = await axios.get(`https://www.hackerrank.com/${username}`);
    const $ = cheerio.load(data);

    // Example of extracting some stats (adjust selectors based on actual HTML structure)
    const scores = $('.hacker-scores');
    const stats = {};

    scores.each((i, element) => {
      const category = $(element).find('.category').text().trim();
      const value = $(element).find('.value').text().trim();
      stats[category] = value;
    });

    return stats;
  } catch (error) {
    console.error(error);
    return null;
  }
};

app.get('/hackerrank/:username', async (req, res) => {
  const username = req.params.username;
  const stats = await getHackerRankStats(username);
  if (stats) {
    res.json(stats);
  } else {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
