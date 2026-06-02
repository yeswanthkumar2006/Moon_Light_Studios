const store = require('./store');

async function seed() {
  await store.write('bookings', []);
  await store.write('contacts', []);
  console.log('Seeded local data files.');
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
