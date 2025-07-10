const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  try {

    //res.json(req.user);
    // res.json(req.user);

    const user = await pool.query("SELECT user_name, user_role FROM users WHERE user_id = $1", [req.user]);
    res.json(user.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Profile routes
router.get("/profile", authorization, async (req, res) => {
  try {
    const profile = await pool.query(
      "SELECT * FROM profile WHERE user_id = $1",
      [req.user]
    );
    res.json(profile.rows[0] || {});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/profile", authorization, async (req, res) => {
  const { program, college, year_level, specialization, topics } = req.body;
  try {
    // Upsert profile: update if exists, else insert
    const existing = await pool.query(
      "SELECT * FROM profile WHERE user_id = $1",
      [req.user]
    );
    let result;
    if (existing.rows.length > 0) {
      result = await pool.query(
        `UPDATE profile SET program = $1, college = $2, year_level = $3, specialization = $4, topics = $5 WHERE user_id = $6 RETURNING *`,
        [program, college, year_level, specialization, topics, req.user]
      );
    } else {
      result = await pool.query(
        `INSERT INTO profile (user_id, program, college, year_level, specialization, topics) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [req.user, program, college, year_level, specialization, topics]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;
