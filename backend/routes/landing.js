const express = require("express");
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const authorization = require("../middleware/authorization");

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // Save files in 'public/uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure a unique file name
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Error: Only image files are allowed");
    }
  },
}).fields([
  { name: "home_image", maxCount: 1 },
  { name: "about_image", maxCount: 1 },
]);

const router = express.Router();

// Get the latest landing page data (GET)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM landing ORDER BY updated_at DESC LIMIT 1"
    );
    if (result.rows.length === 0) {
      // Return empty data instead of 404
      return res.json({
        home_image: "",
        home_title: "",
        home_description: "",
        home_more: "",
        about_image: "",
        about_title: "",
        about_description: "",
        about_link: "",
      });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching landing page data:", err);
    res.status(500).json({ message: "Error fetching landing page data" });
  }
});

// Create a new landing page entry (POST)
router.post("/", upload, async (req, res) => {
  try {
    const {
      home_title,
      home_description,
      home_more,
      about_title,
      about_description,
      about_link,
    } = req.body;

    // Get the image paths from the uploaded files
    const home_image =
      req.files && req.files.home_image
        ? `/uploads/${req.files.home_image[0].filename}`
        : null;
    const about_image =
      req.files && req.files.about_image
        ? `/uploads/${req.files.about_image[0].filename}`
        : null;

    // Insert the landing page data into the database
    const result = await pool.query(
      `INSERT INTO landing (
        home_image, home_title, home_description, home_more, 
        about_image, about_title, about_description, about_link
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        home_image,
        home_title,
        home_description,
        home_more,
        about_image,
        about_title,
        about_description,
        about_link,
      ]
    );

    // Return the newly created landing page data
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting landing page data:", err);
    res.status(500).json({ message: "Error inserting landing page data" });
  }
});

// Update an existing landing page entry (PUT)
router.put("/:id", upload, async (req, res) => {
  const { id } = req.params;
  const {
    home_title,
    home_description,
    home_more,
    about_title,
    about_description,
    about_link,
  } = req.body;

  // Get the image paths for updated images
  const home_image =
    req.files && req.files.home_image
      ? `/uploads/${req.files.home_image[0].filename}`
      : null;
  const about_image =
    req.files && req.files.about_image
      ? `/uploads/${req.files.about_image[0].filename}`
      : null;

  const query = `
    UPDATE landing
    SET 
      home_image = COALESCE($1, home_image), 
      home_title = $2, 
      home_description = $3, 
      home_more = $4,
      about_image = COALESCE($5, about_image),
      about_title = $6, 
      about_description = $7, 
      about_link = $8,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $9
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [
      home_image,
      home_title,
      home_description,
      home_more,
      about_image,
      about_title,
      about_description,
      about_link,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Landing page data not found" });
    }

    // Return the updated landing page data
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating landing page data:", err);
    res.status(500).json({ message: "Error updating landing page data" });
  }
});

//display tutors
router.get("/tutor_subjects", async (req, res) => {
  const result = await pool.query(` 
    SELECT u.name, u.user_id, p.specialization, p.profile_image
    FROM users u
    JOIN profile p ON u.user_id = p.user_id`);
  res.json(result.rows);
});

module.exports = router;
