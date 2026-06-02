const fs = require('fs/promises');
const path = require('path');
const { stillCategories } = require('../backend/config/stills');

const outputPath = path.join(__dirname, '..', 'backend', 'data', 'still-sources.json');
const apiKey = process.env.PEXELS_API_KEY;

async function fetchPexels(query, perPage = 15) {
  if (!apiKey) {
    return {
      query,
      status: 'skipped',
      reason: 'Set PEXELS_API_KEY to fetch fresh public stock references.',
      photos: []
    };
  }

  const url = new URL('https://api.pexels.com/v1/search');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', String(perPage));
  url.searchParams.set('orientation', 'portrait');

  const response = await fetch(url, {
    headers: { Authorization: apiKey }
  });

  if (!response.ok) {
    throw new Error(`Pexels request failed for "${query}": ${response.status}`);
  }

  const data = await response.json();
  return {
    query,
    status: 'fetched',
    photos: data.photos.map((photo) => ({
      id: photo.id,
      photographer: photo.photographer,
      sourceUrl: photo.url,
      imageUrl: photo.src.large2x || photo.src.large || photo.src.portrait
    }))
  };
}

async function main() {
  const results = [];

  for (const category of stillCategories) {
    const query = category.label.replace(/ And /g, ' ').replace(/Shoot/g, 'photography');
    results.push({
      key: category.key,
      label: category.label,
      sourceQuery: category.sourceQuery,
      ...(await fetchPexels(query))
    });
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`);
  console.log(`Saved still source data to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
