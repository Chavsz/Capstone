const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// Create a new appointment
router.post("/", authorization, async (req, res) => {
  try {
    const {
      tutor_id,
      subject,
      topic,
      mode_of_session,
      date,
      start_time,
      end_time,
    } = req.body;
    const user_id = req.user;

    const result = await pool.query(
      `INSERT INTO appointment (user_id, tutor_id, subject, topic, mode_of_session, date, start_time, end_time, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending') 
       RETURNING *`,
      [
        user_id,
        tutor_id,
        subject,
        topic,
        mode_of_session,
        date,
        start_time,
        end_time,
      ]
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

//get all appointments data for admin
router.get("/admin", authorization, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        a.appointment_id,
        a.date,
        a.start_time,
        a.end_time,
        a.subject,
        a.topic,
        a.mode_of_session,
        a.status,
        t.user_name AS tutor_name,
        s.user_name AS student_name,
        f.rating
      FROM appointment a
      JOIN users t ON a.tutor_id = t.user_id
      JOIN users s ON a.user_id = s.user_id
      LEFT JOIN feedback f ON f.appointment_id = a.appointment_id
      ORDER BY a.date DESC, a.start_time DESC`
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
      return res
        .status(403)
        .json({ error: "Not authorized to update this appointment" });
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
      return res
        .status(403)
        .json({ error: "Not authorized to delete this appointment" });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete appointment by admin
router.delete("/admin/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM appointment WHERE appointment_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Submit feedback (rating only) for a completed appointment
router.post("/:id/feedback", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const user_id = req.user;

    // Validate rating
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "Rating must be an integer between 1 and 5." });
    }

    // Check appointment exists, belongs to user, and is completed
    const appointmentResult = await pool.query(
      `SELECT * FROM appointment WHERE appointment_id = $1 AND user_id = $2 AND status = 'completed'`,
      [id, user_id]
    );
    if (appointmentResult.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "You can only rate your own completed appointments." });
    }
    const appointment = appointmentResult.rows[0];

    // Check if feedback already exists for this appointment
    const feedbackResult = await pool.query(
      `SELECT * FROM feedback WHERE user_id = $1 AND tutor_id = $2 AND appointment_id = $3`,
      [user_id, appointment.tutor_id, id]
    );
    if (feedbackResult.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Feedback already submitted for this appointment." });
    }

    // Insert feedback (no comment)
    const insertResult = await pool.query(
      `INSERT INTO feedback (user_id, tutor_id, rating, appointment_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, appointment.tutor_id, rating, id]
    );

    res.json({
      message: "Feedback submitted successfully.",
      feedback: insertResult.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all feedback for a tutor (by tutor_id)
router.get("/tutor/:id/feedback", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT feedback_id, user_id, tutor_id, appointment_id, rating, created_at FROM feedback WHERE tutor_id = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get feedback ratings for all appointments for a tutor
router.get("/tutor/:id/appointment-feedback", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT appointment_id, rating FROM feedback WHERE tutor_id = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all feedbacks for the logged-in tutee
router.get("/feedback/tutee", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const result = await pool.query(
      `SELECT * FROM feedback WHERE user_id = $1`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get count of completed appointments for tutee that are not yet rated
router.get("/tutee/unrated-count", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const result = await pool.query(
      `SELECT COUNT(*) AS unrated_count
       FROM appointment a
       WHERE a.user_id = $1
         AND a.status = 'completed'
         AND NOT EXISTS (
           SELECT 1 FROM feedback f
           WHERE f.user_id = a.user_id
             AND f.tutor_id = a.tutor_id
             AND f.appointment_id = a.appointment_id
         )`,
      [user_id]
    );
    res.json({ unrated_count: parseInt(result.rows[0].unrated_count, 10) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all feedbacks for admin
router.get("/feedback/admin", authorization, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM feedback");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get evaluated appointments for admin (appointments that have feedback)
router.get("/evaluated/admin", authorization, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, f.rating, f.created_at as feedback_date
      FROM appointment a
      INNER JOIN feedback f ON a.appointment_id = f.appointment_id
      ORDER BY f.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// get all feedbacks by tutor_id
router.get("/feedback/tutor/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM feedback WHERE tutor_id = $1", [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
