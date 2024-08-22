const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "recipeguru",
  password: "lol",
  port: 3000, // Or 3000 if that is indeed the correct port
});

(async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to database");
    await client.release();
  } catch (err) {
    console.error("Database connection error", err.stack);
  }
})();
