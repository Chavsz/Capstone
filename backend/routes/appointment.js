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
      `SELECT a.*, u.name as tutor_name, p.program, p.college, p.year_level, p.subject, p.specialization, p.online_link, p.file_link 
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
      `SELECT a.*, u.name as student_name 
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
        t.name AS tutor_name,
        s.name AS student_name
      FROM appointment a
      JOIN users t ON a.tutor_id = t.user_id
      JOIN users s ON a.user_id = s.user_id
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

    // If appointment is confirmed, create a notification for the student
    if (status === "confirmed") {
      const student_id = appointment.rows[0].user_id;
      const tutor_name = await pool.query(
        "SELECT name FROM users WHERE user_id = $1",
        [user_id]
      );

      const notificationContent = `Your appointment has been confirmed by ${
        tutor_name.rows[0]?.name || "your tutor"
      }`;

      await pool.query(
        "INSERT INTO notification (user_id, notification_content, status) VALUES ($1, $2, 'unread')",
        [student_id, notificationContent]
      );
    }

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




// Get count of confirmed appointments for tutee (recently confirmed)
router.get("/tutee/confirmed-count", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const result = await pool.query(
      `SELECT COUNT(*) AS confirmed_count
       FROM appointment a
       WHERE a.user_id = $1
         AND a.status = 'confirmed'
         AND a.updated_at >= NOW() - INTERVAL '24 hours'`,
      [user_id]
    );
    res.json({ confirmed_count: parseInt(result.rows[0].confirmed_count, 10) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});



// Get count of pending appointments for tutor
router.get("/tutor/pending-count", authorization, async (req, res) => {
  try {
    const tutor_id = req.user;
    const result = await pool.query(
      `SELECT COUNT(*) AS pending_count
        FROM appointment a
        WHERE a.tutor_id = $1
        AND a.status = 'pending'`,
      [tutor_id]
    );
    res.json({ pending_count: parseInt(result.rows[0].pending_count, 10) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get notifications for user
router.get("/notifications", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const result = await pool.query(
      `SELECT * FROM notification 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Mark notification as read
router.put("/notifications/:id/read", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user;

    const result = await pool.query(
      "UPDATE notification SET status = 'read' WHERE notification_id = $1 AND user_id = $2 RETURNING *",
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Get unread notifications count
router.get("/notifications/unread-count", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    const result = await pool.query(
      "SELECT COUNT(*) AS unread_count FROM notification WHERE user_id = $1 AND status = 'unread'",
      [user_id]
    );
    res.json({ unread_count: parseInt(result.rows[0].unread_count, 10) });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Auto-decline appointments that have been pending for more than 14 hours
const autoDeclinePendingAppointments = async () => {
  try {
    // Find appointments that have been pending for more than 14 hours
    const result = await pool.query(
      `SELECT appointment_id, user_id, tutor_id, subject, topic, date, start_time, end_time
      FROM appointment 
      WHERE status = 'pending' 
      AND created_at < NOW() - INTERVAL '14 hours'`,
      []
    );

    if (result.rows.length > 0) {
      // Update all found appointments to declined status
      const updateResult = await pool.query(
        `UPDATE appointment 
        SET status = 'declined', updated_at = NOW() 
        WHERE appointment_id = ANY($1)`,
        [result.rows.map((row) => row.appointment_id)]
      );

      // Create notifications for students about auto-declined appointments
      for (const appointment of result.rows) {
        const notificationContent = `Your appointment for ${appointment.subject} - ${appointment.topic} on ${appointment.date} at ${appointment.start_time} has been automatically declined due to no response from the tutor within 14 hours.`;

        await pool.query(
          "INSERT INTO notification (user_id, notification_content, status) VALUES ($1, $2, 'unread')",
          [appointment.user_id, notificationContent]
        );
      }
    } 
  } catch (err) {
    console.error(err.message);
  }
};

// Check for ended appointments and create notifications for tutors
const checkEndedAppointments = async () => {
  try {
    // Find confirmed appointments that have just ended (within the last minute)
    // and haven't already generated an end notification today
    const result = await pool.query(
      `SELECT a.appointment_id, a.tutor_id, a.subject, a.topic, a.date, a.start_time, a.end_time, u.name as student_name
      FROM appointment a
      JOIN users u ON a.user_id = u.user_id
      WHERE a.status = 'confirmed' 
      AND a.date = CURRENT_DATE
      AND a.end_time <= CURRENT_TIME
      AND a.end_time >= CURRENT_TIME - INTERVAL '1 minute'
      AND NOT EXISTS (
        SELECT 1 FROM notification n 
        WHERE n.user_id = a.tutor_id 
        AND n.notification_content LIKE '%has ended%'
        AND n.created_at >= CURRENT_DATE
        AND n.notification_content LIKE '%' || a.subject || '%'
        AND n.notification_content LIKE '%' || a.topic || '%'
      )`,
      []
    );

    if (result.rows.length > 0) {
      console.log(`Found ${result.rows.length} appointments that have ended`);

      // Create notifications for tutors about ended appointments
      for (const appointment of result.rows) {
        const notificationContent = `Your appointment with ${appointment.student_name} for ${appointment.subject} - ${appointment.topic} has ended at ${appointment.end_time}.`;

        await pool.query(
          "INSERT INTO notification (user_id, notification_content, status) VALUES ($1, $2, 'unread')",
          [appointment.tutor_id, notificationContent]
        );
      }
    }
  } catch (err) {
    console.error(err.message);
  }
};

// Manual endpoint to trigger auto-decline (for testing)
router.post("/auto-decline", authorization, async (req, res) => {
  try {
    await autoDeclinePendingAppointments();
    res.json({ message: "Auto-decline process completed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Manual endpoint to trigger appointment end check (for testing)
router.post("/check-ended", authorization, async (req, res) => {
  try {
    await checkEndedAppointments();
    res.json({ message: "Appointment end check completed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Test endpoint to create a sample appointment that ends soon (for testing)
router.post("/test-appointment", authorization, async (req, res) => {
  try {
    const user_id = req.user;
    
    // Get a tutor for testing
    const tutorResult = await pool.query(
      "SELECT user_id FROM users WHERE role = 'tutor' LIMIT 1"
    );
    
    if (tutorResult.rows.length === 0) {
      return res.status(400).json({ error: "No tutors found for testing" });
    }
    
    const tutor_id = tutorResult.rows[0].user_id;
    
    // Create a test appointment that ends in 1 minute
    const now = new Date();
    const endTime = new Date(now.getTime() + 60000); // 1 minute from now
    
    const result = await pool.query(
      `INSERT INTO appointment (user_id, tutor_id, subject, topic, mode_of_session, date, start_time, end_time, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'confirmed') 
       RETURNING *`,
      [
        user_id,
        tutor_id,
        "Test Subject",
        "Test Topic",
        "Online",
        now.toISOString().split('T')[0], // Today's date
        now.toTimeString().split(' ')[0].substring(0, 5), // Current time HH:MM
        endTime.toTimeString().split(' ')[0].substring(0, 5), // End time HH:MM
      ]
    );

    res.json({ 
      message: "Test appointment created successfully",
      appointment: result.rows[0],
      note: "This appointment will end in 1 minute and should trigger a notification"
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Export the functions for use in the main server
module.exports = { router, autoDeclinePendingAppointments, checkEndedAppointments };
