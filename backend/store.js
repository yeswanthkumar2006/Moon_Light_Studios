const fs = require('fs/promises');
const path = require('path');

const dataDir = path.join(__dirname, 'data');

async function ensureDataFile(name, fallback) {
  await fs.mkdir(dataDir, { recursive: true });
  const file = path.join(dataDir, `${name}.json`);
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, JSON.stringify(fallback, null, 2));
  }
  return file;
}

async function read(name, fallback = []) {
  const file = await ensureDataFile(name, fallback);
  const raw = await fs.readFile(file, 'utf8');
  return JSON.parse(raw || '[]');
}

async function write(name, value) {
  const file = await ensureDataFile(name, Array.isArray(value) ? [] : {});
  await fs.writeFile(file, JSON.stringify(value, null, 2));
  return value;
}

module.exports = { read, write };
