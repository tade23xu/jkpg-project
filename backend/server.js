const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "jkpg",
  password: "postgres",
  port: 5432,
});

// GET all stores
app.get("/api/stores", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stores ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add store
app.post("/api/stores", async (req, res) => {
  try {
    const { name, district, category } = req.body;

    if (!name || !district || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await pool.query(
      "INSERT INTO stores (name, district, category) VALUES ($1, $2, $3) RETURNING *",
      [name, district, category],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update store
app.put("/api/stores/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, district, category } = req.body;

    if (!name || !district || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await pool.query(
      "UPDATE stores SET name=$1, district=$2, category=$3 WHERE id=$4 RETURNING *",
      [name, district, category, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE store
app.delete("/api/stores/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM stores WHERE id=$1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }

    res.json({ message: "Deleted", deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// listen
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
