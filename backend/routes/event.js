const express = require("express");
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); 


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); //
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Error: Only image files are allowed");
    }
  },
});

const router = express.Router();

// POST: Create a new event with an image
router.post("/", upload.single("event_image"), async (req, res) => {
  try {
    const { event_title, event_description, event_time, event_date, event_location } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const eventImageUrl = `/uploads/${req.file.filename}`; // Construct image URL

    const result = await pool.query(
      "INSERT INTO event (event_title, event_description, event_time, event_date, event_location, event_image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [event_title, event_description, event_time, event_date, event_location, eventImageUrl]
    );

    res.json({
      message: "Event created successfully",
      event: result.rows[0], 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// GET: Get all events
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM event");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// GET: Get a specific event by its ID
router.get("/:id", async (req, res) => {
  try {
    const eventId = req.params.id; // Corrected event_id to id in URL parameter

    const result = await pool.query("SELECT * FROM event WHERE id = $1", [
      eventId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// PUT: Update an existing event
router.put("/:id", upload.single("event_image"), async (req, res) => {
  try {
    const eventId = req.params.id; // Corrected event_id to id in URL parameter
    const { event_title, event_description, event_time, event_date, event_location } = req.body;

    let eventImageUrl = null;
    if (req.file) {
      eventImageUrl = `/uploads/${req.file.filename}`; // Construct image URL
    }

    // Check if the event exists
    const existing = await pool.query("SELECT * FROM event WHERE id = $1", [
      eventId,
    ]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    // If an image is being updated, delete the old image
    if (eventImageUrl) {
      const oldImage = existing.rows[0].event_image;
      if (oldImage && oldImage.startsWith("/uploads/")) {
        const oldImagePath = path.join(__dirname, "..", "public", oldImage.substring(8));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Remove the old image from the server
        }
      }
    }

    // Update the event in the database
    await pool.query(
      "UPDATE event SET event_title = $1, event_description = $2, event_time = $3, event_date = $4, event_location = $5, event_image = $6 WHERE id = $7",
      [
        event_title,
        event_description,
        event_time,
        event_date,
        event_location,
        eventImageUrl || existing.rows[0].event_image, // Keep the old image if not updating
        eventId,
      ]
    );

    res.json({
      message: "Event updated successfully",
      event: {
        id: eventId,
        event_title,
        event_description,
        event_time,
        event_date,
        event_location,
        event_image: eventImageUrl || existing.rows[0].event_image,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//deleteevent
router.delete("/:id", async (req, res) => {
  try {
    const eventId = req.params.id; // Get event id from URL

    // Check if the event exists
    const existing = await pool.query("SELECT * FROM event WHERE id = $1", [
      eventId,
    ]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    // If the event has an image, remove it from the server
    const oldImage = existing.rows[0].event_image;
    if (oldImage && oldImage.startsWith("/uploads/")) {
      const oldImagePath = path.join(__dirname, "..", "public", oldImage.substring(8));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Remove the old image from the server
      }
    }

    // Delete the event from the database
    await pool.query("DELETE FROM event WHERE id = $1", [eventId]);

    res.json({
      message: "Event deleted successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;
