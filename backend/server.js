const express = require("express");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
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
/****************
 * session for admin login
 **************/
// this is if you want the site on localhost 3000
app.use(express.static("../frontend"));




const SesSecret = "SecretSession" //session secret

const sessions = {}

app.use(cookieParser(SesSecret))
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
    const { name, district, url } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const result = await pool.query(
      "INSERT INTO stores (name, district, url) VALUES ($1, $2, $3) RETURNING *",
      [name, district || null, url || null],
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
    const { name, district, url } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const result = await pool.query(
      "UPDATE stores SET name=$1, district=$2, url=$3 WHERE id=$4 RETURNING *",
      [name, district || null, url || null, id],
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
/*********************
 * Admin Login 
 * ******************/
app.post("/Login",express.json(),(req,res)=>{
  const {name,password} = req.body

  if(name === "admin" && password === "admin123"){
    const token = crypto.randomBytes(64).toString('hex')
    sessions[token] = {name}

    res.cookie("authToken", token, {signed: true, httpOnly:true,sameSite: "lax"})

    res.status(201).json({success:true });

  }else{
    res.status(401).json({success:false });
  }

})

/********************
 * check if admins is logged in
********************/
app.get("/checkLoggedIn",(req,res)=>{
  const token = req.signedCookies.authToken
  res.json({isLoggedIn: token && sessions[token] ? true : false})
})

/********************
 * Logout
********************/
app.get('/logout', (req, res)=> {
  const token = req.signedCookies.authToken

  if(token){
    delete sessions[token]
  }
  res.clearCookie("authToken")
  res.status(201).json({success:true})
})
// listen
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
