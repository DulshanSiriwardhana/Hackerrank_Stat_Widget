const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

// Function to get HackerRank stats for a given username
const getHackerRankStats = async (username) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`https://www.hackerrank.com/${username}`, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for the profile overview section to load
    await page.waitForSelector('.profile-overview', { timeout: 60000 });  // Adjust selector if needed

    // Extract stats from the page
    const stats = await page.evaluate(() => {
      const result = {};

      // Replace these selectors with the actual ones from HackerRank
      const batches = document.querySelector('.batches-earned') ? document.querySelector('.batches-earned').innerText.trim() : 'N/A';
      const starts = document.querySelector('.starts-earned') ? document.querySelector('.starts-earned').innerText.trim() : 'N/A';
      const certificates = document.querySelector('.certificates-earned') ? document.querySelector('.certificates-earned').innerText.trim() : 'N/A';
      
      result.batches = batches;
      result.starts = starts;
      result.certificates = certificates;

      return result;
    });

    await browser.close();
    console.log('Stats:', stats);  // Log the stats for debugging
    return stats;
  } catch (error) {
    console.error('Error fetching HackerRank stats:', error);
    return null;
  }
};

// Route to fetch HackerRank stats by username
app.get('/hackerrank/:username', async (req, res) => {
  const username = req.params.username;
  console.log('Fetching stats for username:', username);
  const stats = await getHackerRankStats(username);
  if (stats) {
    res.json(stats);
  } else {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
