const express = require("express");
const router = express.Router();
const pool = require("../db"); // Make sure this path is correct to your database pool connection
const authorization = require("../middleware/authorization");

// GET: Retrieve all announcements
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM announcement ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: Retrieve a specific announcement by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM announcement WHERE announcement_id = $1", [id]);
    
    if (result.rows.length > 0) {
      return res.json(result.rows[0]);
    } else {
      return res.status(404).json({ message: "Announcement not found." });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// POST: Create a new announcement
router.post("/", authorization, async (req, res) => {
  try {
    const { announcement_content } = req.body;
    const user_id = req.user;

    // Insert new announcement into the database
    const result = await pool.query(
      "INSERT INTO announcement (user_id, announcement_content) VALUES ($1, $2) RETURNING *",
      [user_id, announcement_content]
    );
    res.json({
      message: "Announcement created successfully.",
      announcement: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT: Edit an existing announcement
router.put("/:id", authorization, async (req, res) => {
  try {
    const { announcement_content } = req.body;
    const { id } = req.params;
    const user_id = req.user;

    // Check if an announcement exists with the provided ID and belongs to the user
    const existingAnnouncement = await pool.query(
      "SELECT * FROM announcement WHERE announcement_id = $1 AND user_id = $2",
      [id, user_id]
    );
    if (existingAnnouncement.rows.length === 0) {
      return res.status(404).json({ message: "Announcement not found or not authorized." });
    }

    // Update the announcement content
    const result = await pool.query(
      "UPDATE announcement SET announcement_content = $1, updated_at = NOW() WHERE announcement_id = $2 RETURNING *",
      [announcement_content, id]
    );
    res.json({
      message: "Announcement updated successfully.",
      announcement: result.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE: Delete an existing announcement
router.delete("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user;

    // Check if an announcement exists with the provided ID and belongs to the user
    const existingAnnouncement = await pool.query(
      "SELECT * FROM announcement WHERE announcement_id = $1 AND user_id = $2",
      [id, user_id]
    );
    if (existingAnnouncement.rows.length === 0) {
      return res.status(404).json({ message: "Announcement not found or not authorized." });
    }

    // Delete the announcement
    await pool.query("DELETE FROM announcement WHERE announcement_id = $1", [id]);
    res.json({ message: "Announcement deleted successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
