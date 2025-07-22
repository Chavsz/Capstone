const express = require("express");
const router = express.Router();
const pool = require("../db"); // Make sure this path is correct to your database pool connection

// GET: Retrieve the existing announcement (if any)
router.get("/", async (req, res) => {
  try {
    // Check if there's an existing announcement
    const result = await pool.query("SELECT * FROM announcement LIMIT 1");
    if (result.rows.length > 0) {
      return res.json(result.rows[0]); // Return the first (and only) announcement
    } else {
      return res.status(404).json({ message: "No announcement found." });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// POST: Create a new announcement (only if there isn't an existing one)
router.post("/", async (req, res) => {
  try {
    const { announcement_content } = req.body;

    // Check if an announcement already exists
    const existingAnnouncement = await pool.query("SELECT * FROM announcement LIMIT 1");
    if (existingAnnouncement.rows.length > 0) {
      return res.status(400).json({ message: "Only one announcement can exist." });
    }

    // Insert new announcement into the database
    const result = await pool.query(
      "INSERT INTO announcement (announcement_content) VALUES ($1) RETURNING *",
      [announcement_content]
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

// PUT: Edit the existing announcement (if any)
router.put("/:id", async (req, res) => {
  try {
    const { announcement_content } = req.body;
    const { id } = req.params;

    // Check if an announcement exists with the provided ID
    const existingAnnouncement = await pool.query(
      "SELECT * FROM announcement WHERE id = $1",
      [id]
    );
    if (existingAnnouncement.rows.length === 0) {
      return res.status(404).json({ message: "Announcement not found." });
    }

    // Update the announcement content
    const result = await pool.query(
      "UPDATE announcement SET announcement_content = $1 WHERE id = $2 RETURNING *",
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

// DELETE: Delete the existing announcement (if any)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if an announcement exists with the provided ID
    const existingAnnouncement = await pool.query(
      "SELECT * FROM announcement WHERE id = $1",
      [id]
    );
    if (existingAnnouncement.rows.length === 0) {
      return res.status(404).json({ message: "Announcement not found." });
    }

    // Delete the announcement
    await pool.query("DELETE FROM announcement WHERE id = $1", [id]);
    res.json({ message: "Announcement deleted successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
