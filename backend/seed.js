const { Pool } = require("pg");
const stores = require("./stores.json");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "jkpg",
  password: "postgres",
  port: 5432,
});

// Derive a simple category from store name keywords
function guessCategory(name) {
  const n = name.toLowerCase();
  if (n.includes("apotek") || n.includes("hälso") || n.includes("life natur")) return "Health & Pharmacy";
  if (n.includes("optik") || n.includes("synsam") || n.includes("specsavers") || n.includes("synoptik") || n.includes("smarteyes")) return "Optician";
  if (n.includes("sko") || n.includes("skor") || n.includes("shoes") || n.includes("foten") || n.includes("rizzo")) return "Shoes";
  if (n.includes("tatoo") || n.includes("tattoo") || n.includes("bläck")) return "Tattoo & Body Art";
  if (n.includes("guld") || n.includes("smycke") || n.includes("ur &") || n.includes("urmak") || n.includes("urmäst")) return "Jewellery & Watches";
  if (n.includes("blomm") || n.includes("planta")) return "Flowers & Plants";
  if (n.includes("foto")) return "Photography";
  if (n.includes("bok")) return "Books";
  if (n.includes("musik")) return "Music";
  if (n.includes("second hand") || n.includes("nytt & bytt") || n.includes("pmu")) return "Second Hand";
  if (n.includes("coop") || n.includes("hemköp") || n.includes("ica") || n.includes("livs") || n.includes("systembolaget") || n.includes("vätterfisk")) return "Food & Drink";
  if (n.includes("resehuset") || n.includes("ticket") || n.includes("forex") || n.includes("resecentrum")) return "Travel & Currency";
  if (n.includes("press")) return "Press & Convenience";
  if (n.includes("apotek")) return "Pharmacy";
  if (n.includes("fritid") || n.includes("dive") || n.includes("boardlife") || n.includes("golden athlete") || n.includes("sunoff")) return "Sports & Outdoor";
  if (n.includes("inredning") || n.includes("hemtex") || n.includes("lagerhaus") || n.includes("cervera") || n.includes("nordisk möbel") || n.includes("kvänum") || n.includes("hemmakväll")) return "Home & Interior";
  if (n.includes("konst") || n.includes("galleri") || n.includes("ateljé") || n.includes("atelier") || n.includes("lloyd") || n.includes("katrin")) return "Art & Gallery";
  if (n.includes("brud") || n.includes("fest") || n.includes("party")) return "Bridal & Party";
  if (n.includes("skrädderi") || n.includes("sycenter") || n.includes("skomakeri") || n.includes("kemtvätt")) return "Repairs & Services";
  if (n.includes("tobak") || n.includes("cigarr")) return "Tobacco";
  if (n.includes("lås") || n.includes("larm")) return "Security";
  if (n.includes("begravning")) return "Funeral Services";
  if (n.includes("mac") || n.includes("kjell") || n.includes("hi-fi") || n.includes("balance ljud")) return "Electronics & Tech";
  if (n.includes("bank") || n.includes("forex")) return "Finance";
  return "Fashion & Accessories";
}

async function seed() {
  const client = await pool.connect();
  try {
    // Create the database if running fresh — create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id       SERIAL PRIMARY KEY,
        name     VARCHAR(255) NOT NULL,
        district VARCHAR(100),
        category VARCHAR(100),
        url      VARCHAR(500)
      );
    `);
    console.log("Table 'stores' ready.");

    // Clear existing data so we can re-seed cleanly
    await client.query("DELETE FROM stores;");
    await client.query("ALTER SEQUENCE stores_id_seq RESTART WITH 1;");
    console.log("Cleared existing store rows.");

    // Insert every store from stores.json
    for (const store of stores) {
      const category = guessCategory(store.name);
      await client.query(
        "INSERT INTO stores (name, district, category, url) VALUES ($1, $2, $3, $4)",
        [store.name, store.district || null, category, store.url || null]
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
