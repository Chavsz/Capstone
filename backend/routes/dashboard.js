const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
  try {

    //res.json(req.user);
    // res.json(req.user);

    const user = await pool.query("SELECT name, role FROM users WHERE user_id = $1", [req.user]);
    res.json(user.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Profile routes
router.get("/profile", authorization, async (req, res) => {
  try {
    // First get the user's role
    const user = await pool.query(
      "SELECT role FROM users WHERE user_id = $1",
      [req.user]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const userRole = user.rows[0].role;
    
    let profile;
    if (userRole === 'tutor') {
      // Query the profile table for tutors
      profile = await pool.query(
        "SELECT * FROM profile WHERE user_id = $1",
        [req.user]
      );
    } else if (userRole === 'student') {
      // Query the student_profile table for students
      profile = await pool.query(
        "SELECT * FROM student_profile WHERE user_id = $1",
        [req.user]
      );
    } else {
      return res.status(400).json({ error: "Invalid user role" });
    }
    
    res.json(profile.rows[0] || {});
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update tutor profile
router.put("/profile", authorization, async (req, res) => {
  const { nickname, program, college, year_level, subject, specialization, profile_image } = req.body;
  try {
    // Upsert profile: update if exists, else insert
    const existing = await pool.query(
      "SELECT * FROM profile WHERE user_id = $1",
      [req.user]
    );
    let result;
    if (existing.rows.length > 0) {
      result = await pool.query(
        `UPDATE profile SET nickname = $1, program = $2, college = $3, year_level = $4, subject = $5, specialization = $6, profile_image = $7 WHERE user_id = $8 RETURNING *`,
        [nickname, program, college, year_level, subject, specialization, profile_image, req.user]
      );
    } else {
      result = await pool.query(
        `INSERT INTO profile (user_id, nickname, program, college, year_level, subject, specialization, profile_image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [nickname, req.user, program, college, year_level, subject, specialization, profile_image]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update student profile
router.put("/profile/student", authorization, async (req, res) => {
  const { program, college, year_level, profile_image } = req.body;
  try {
    // Upsert profile: update if exists, else insert
    const existing = await pool.query(
      "SELECT * FROM student_profile WHERE user_id = $1",
      [req.user]
    );
    let result;
    if (existing.rows.length > 0) {
      result = await pool.query(
        `UPDATE student_profile SET program = $1, college = $2, year_level = $3, profile_image = $4 WHERE user_id = $5 RETURNING *`,
        [program, college, year_level, profile_image, req.user]
      );
    } else {
      result = await pool.query(
        `INSERT INTO student_profile (user_id, program, college, year_level, profile_image) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [req.user, program, college, year_level, profile_image]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Schedule routes - Updated to work with profile_id instead of user_id
router.get("/schedule", authorization, async (req, res) => {
  try {
    // First get the profile_id for the current user
    const profile = await pool.query(
      "SELECT profile_id FROM profile WHERE user_id = $1",
      [req.user]
    );
    
    if (profile.rows.length === 0) {
      return res.json([]);
    }
    
    const schedules = await pool.query(
      "SELECT * FROM schedule WHERE profile_id = $1 ORDER BY day, start_time",
      [profile.rows[0].profile_id]
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
    // First get the profile_id for the current user
    const profile = await pool.query(
      "SELECT profile_id FROM profile WHERE user_id = $1",
      [req.user]
    );
    
    if (profile.rows.length === 0) {
      return res.status(400).json({ error: "Profile not found. Please create a profile first." });
    }
    
    const result = await pool.query(
      `INSERT INTO schedule (profile_id, day, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *`,
      [profile.rows[0].profile_id, day, start_time, end_time]
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
    // First get the profile_id for the current user
    const profile = await pool.query(
      "SELECT profile_id FROM profile WHERE user_id = $1",
      [req.user]
    );
    
    if (profile.rows.length === 0) {
      return res.status(400).json({ error: "Profile not found" });
    }
    
    const result = await pool.query(
      `UPDATE schedule SET day = $1, start_time = $2, end_time = $3 WHERE schedule_id = $4 AND profile_id = $5 RETURNING *`,
      [day, start_time, end_time, id, profile.rows[0].profile_id]
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
    // First get the profile_id for the current user
    const profile = await pool.query(
      "SELECT profile_id FROM profile WHERE user_id = $1",
      [req.user]
    );
    
    if (profile.rows.length === 0) {
      return res.status(400).json({ error: "Profile not found" });
    }
    
    await pool.query(
      `DELETE FROM schedule WHERE schedule_id = $1 AND profile_id = $2`,
      [id, profile.rows[0].profile_id]
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

// Get tutor schedules by tutor_id - Updated to work with profile_id
router.get("/schedule/:tutorId", async (req, res) => {
  try {
    const { tutorId } = req.params;
    
    // First get the profile_id for the tutor
    const profile = await pool.query(
      "SELECT profile_id FROM profile WHERE user_id = $1",
      [tutorId]
    );
    
    if (profile.rows.length === 0) {
      return res.json([]);
    }
    
    const schedules = await pool.query(
      "SELECT * FROM schedule WHERE profile_id = $1 ORDER BY day, start_time",
      [profile.rows[0].profile_id]
    );
    res.json(schedules.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all users for admin
router.get("/users", authorization, async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all students from each college who have booked an appointment
router.get("/students", authorization, async (req, res) => {
  try {
    const students = await pool.query(`
      SELECT 
        sp.college,
        COUNT(DISTINCT a.user_id) as student_count
      FROM appointment a
      JOIN student_profile sp ON a.user_id = sp.user_id
      WHERE sp.college IS NOT NULL
      GROUP BY sp.college
      ORDER BY student_count DESC
    `); 
    res.json(students.rows);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
