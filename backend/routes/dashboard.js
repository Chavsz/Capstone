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
  const { program, college, year_level, specialization, topics, profile_image } = req.body;
  try {
    // Upsert profile: update if exists, else insert
    const existing = await pool.query(
      "SELECT * FROM profile WHERE user_id = $1",
      [req.user]
    );
    let result;
    if (existing.rows.length > 0) {
      result = await pool.query(
        `UPDATE profile SET program = $1, college = $2, year_level = $3, specialization = $4, topics = $5, profile_image = $6 WHERE user_id = $7 RETURNING *`,
        [program, college, year_level, specialization, topics, profile_image, req.user]
      );
    } else {
      result = await pool.query(
        `INSERT INTO profile (user_id, program, college, year_level, specialization, topics, profile_image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [req.user, program, college, year_level, specialization, topics, profile_image]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Schedule routes
router.get("/schedule", authorization, async (req, res) => {
  try {
    const schedules = await pool.query(
      "SELECT * FROM schedule WHERE user_id = $1 ORDER BY day, start_time",
      [req.user]
    );
    res.json(schedules.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add a new schedule slot
router.post("/schedule", authorization, async (req, res) => {
  const { day, start_time, end_time } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO schedule (user_id, day, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user, day, start_time, end_time]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update a schedule slot
router.put("/schedule/:id", authorization, async (req, res) => {
  const { id } = req.params;
  const { day, start_time, end_time } = req.body;
  try {
    const result = await pool.query(
      `UPDATE schedule SET day = $1, start_time = $2, end_time = $3 WHERE schedule_id = $4 AND user_id = $5 RETURNING *`,
      [day, start_time, end_time, id, req.user]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete a schedule slot
router.delete("/schedule/:id", authorization, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      `DELETE FROM schedule WHERE schedule_id = $1 AND user_id = $2`,
      [id, req.user]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// get all appointments for admin dashboard

router.get("/appointment/admin", authorization, async (req, res) => {
  try {
    const appointments = await pool.query("SELECT * FROM appointment");
    res.json(appointments.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
