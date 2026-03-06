const { Pool } = require("pg");
const stores = require("./stores.json");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "jkpg",
  password: "postgres",
  port: 5432,
});

async function seed() {
  const client = await pool.connect();
  try {
    // Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        district VARCHAR(100),
        url VARCHAR(500)
      );
    `);

    console.log("Table 'stores' ready.");

    // Clear old data
    await client.query("DELETE FROM stores;");
    await client.query("ALTER SEQUENCE stores_id_seq RESTART WITH 1;");

    console.log("Cleared existing store rows.");

    // Insert stores
    for (const store of stores) {
      await client.query(
        "INSERT INTO stores (name, district, url) VALUES ($1, $2, $3)",
        [store.name, store.district || null, store.url || null],
      );
    }

    console.log(`Seeded ${stores.length} stores successfully.`);
  } catch (err) {
    console.error("Seed error:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
