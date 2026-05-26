const fs = require('fs');
const path = require('path');

const dataFile = path.join(process.cwd(), 'data', 'market-news.json');

// Read current data
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

console.log(`Total articles before cleanup: ${data.news.length}`);

// Track seen titles and links
const seenTitles = new Set();
const seenLinks = new Set();
const uniqueNews = [];
let duplicatesRemoved = 0;

// Keep only unique articles (first occurrence)
data.news.forEach(article => {
  const normalizedTitle = article.title.toLowerCase().trim();

  if (!seenTitles.has(normalizedTitle) && !seenLinks.has(article.link)) {
    uniqueNews.push(article);
    seenTitles.add(normalizedTitle);
    seenLinks.add(article.link);
  } else {
    duplicatesRemoved++;
    console.log(`Removed duplicate: ${article.title.substring(0, 60)}...`);
  }
});

// Update data
data.news = uniqueNews;

// Save cleaned data
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');

console.log(`\n✅ Cleanup complete!`);
console.log(`Total articles after cleanup: ${data.news.length}`);
console.log(`Duplicates removed: ${duplicatesRemoved}`);
