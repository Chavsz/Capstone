const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// Create a new appointment
router.post("/", authorization, async (req, res) => {
  try {
    const { tutor_id, subject, topic, mode_of_session, date, start_time, end_time } = req.body;
    const user_id = req.user;

    const result = await pool.query(
      `INSERT INTO appointment (user_id, tutor_id, subject, topic, mode_of_session, date, start_time, end_time, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending') 
       RETURNING *`,
      [user_id, tutor_id, subject, topic, mode_of_session, date, start_time, end_time]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get appointments for a tutee (student)
router.get("/tutee", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const result = await pool.query(
      `SELECT a.*, u.user_name as tutor_name, p.program, p.college, p.year_level, p.specialization 
       FROM appointment a 
       JOIN users u ON a.tutor_id = u.user_id 
       LEFT JOIN profile p ON a.tutor_id = p.user_id 
       WHERE a.user_id = $1 
       ORDER BY a.date DESC, a.start_time DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get appointments for a tutor
router.get("/tutor", authorization, async (req, res) => {
  try {
    const tutor_id = req.user;
    const result = await pool.query(
      `SELECT a.*, u.user_name as student_name 
       FROM appointment a 
       JOIN users u ON a.user_id = u.user_id 
       WHERE a.tutor_id = $1 
       ORDER BY a.date DESC, a.start_time DESC`,
      [tutor_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update appointment status (confirm/decline)
router.put("/:id/status", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user_id = req.user;

    // Check if user is authorized to update this appointment
    const appointment = await pool.query(
      "SELECT * FROM appointment WHERE appointment_id = $1 AND (user_id = $2 OR tutor_id = $2)",
      [id, user_id]
    );

    if (appointment.rows.length === 0) {
      return res.status(403).json({ error: "Not authorized to update this appointment" });
    }

    const result = await pool.query(
      "UPDATE appointment SET status = $1, updated_at = NOW() WHERE appointment_id = $2 RETURNING *",
      [status, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete appointment (only by the student who created it)
router.delete("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user;

    const result = await pool.query(
      "DELETE FROM appointment WHERE appointment_id = $1 AND user_id = $2 RETURNING *",
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Not authorized to delete this appointment" });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router; 