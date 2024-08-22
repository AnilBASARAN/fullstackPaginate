const path = require("path");
const express = require("express");
const router = express.Router();
const { Pool } = require("pg");  // Correctly import Pool

// Client-side static assets
router.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));
router.get("/client.js", (_, res) =>
  res.sendFile(path.join(__dirname, "./client.js"))
);

/**
 * Student code starts here
 */
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "recipeguru",
  password: "sqldeney23",
  port: 5432,
});

router.get("/type", async (req, res) => {
  const { type } = req.query;
  console.log("get ingredients", type);
  try {
    const { rows } = await pool.query(
      "SELECT * FROM ingredients WHERE type = $1",
      [type]
    );
    res.json({ rows });
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/search", async (req, res) => {
  let { term, page } = req.query;
  page = page ? parseInt(page, 10) : 0; // Ensure page is an integer
  console.log("search ingredients", term, page);

  let whereClause = '';
  const params = [page * 5];
  if (term) {
    whereClause = `WHERE CONCAT(title, type) ILIKE $2`;
    params.push(`%${term}%`);
  }

  try {
    const { rows } = await pool.query(
      `SELECT *, COUNT(*) OVER ()::INTEGER AS total_count FROM ingredients ${whereClause} OFFSET $1 LIMIT 5`,
      params
    );
    res.status(200).json({ rows });
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Student code ends here
 */

module.exports = router;
