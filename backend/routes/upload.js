const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authorization = require("../middleware/authorization");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload profile image
router.post("/profile-image", authorization, upload.single('profile_image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Update the profile with the new image URL
    const pool = require("../db");
    const existing = await pool.query(
      "SELECT * FROM profile WHERE user_id = $1",
      [req.user]
    );

    if (existing.rows.length > 0) {
      // Delete old image if it exists
      const oldImage = existing.rows[0].profile_image;
      if (oldImage && oldImage.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', 'public', oldImage.substring(8));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      await pool.query(
        "UPDATE profile SET profile_image = $1 WHERE user_id = $2",
        [imageUrl, req.user]
      );
    } else {
      await pool.query(
        "INSERT INTO profile (user_id, profile_image) VALUES ($1, $2)",
        [req.user, imageUrl]
      );
    }

    res.json({ 
      message: "Profile image uploaded successfully",
      imageUrl: imageUrl 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
//homeimage
router.post("/home-image", authorization, upload.single('home_image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const homeImageUrl = `/uploads/${req.file.filename}`;  // Construct image URL
    
    // Update the landing page with the new home image URL
    const pool = require("../db");
    const existing = await pool.query(
      "SELECT * FROM landing WHERE id = $1",
      [1]  // Pass the appropriate landing page ID here
    );

    if (existing.rows.length > 0) {
      // Delete old image if it exists
      const oldImage = existing.rows[0].home_image;
      if (oldImage && oldImage.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', 'public', oldImage.substring(8));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);  // Remove old file from the server
        }
      }

      // Update the home image in the database
      await pool.query(
        "UPDATE landing SET home_image = $1 WHERE id = $2",
        [homeImageUrl, 1]  // Make sure to pass the correct landing page ID here
      );
    } else {
      // Insert new home image if no data exists
      await pool.query(
        "INSERT INTO landing (home_image) VALUES ($1)",
        [homeImageUrl]
      );
    }

    res.json({ 
      message: "Home image uploaded successfully",
      homeImageUrl: homeImageUrl 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
//eventimage
router.post("/event-image/:event_id", authorization, upload.single('event_image'), async (req, res) => {
  try {
    const eventId = req.params.event_id;  

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const eventImageUrl = `/uploads/${req.file.filename}`;

    const pool = require("../db");

    // Check if the event already exists
    const existing = await pool.query(
      "SELECT * FROM event WHERE event_id = $1",
      [eventId]  // Use the event ID passed in the URL
    );

    if (existing.rows.length > 0) {
      // Delete the old image if it exists
      const oldImage = existing.rows[0].event_image;
      if (oldImage && oldImage.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', 'public', oldImage.substring(8));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);  // Remove old file from the server
        }
      }

      await pool.query(
        "UPDATE event SET event_image = $1 WHERE event_id = $2",
        [eventImageUrl, eventId]  
      );
    } else {
      // Insert new event image if the event doesn't exist
      await pool.query(
        "INSERT INTO event (event_id, event_image) VALUES ($1, $2)",
        [eventId, eventImageUrl]
      );
    }

    res.json({
      message: "Event image uploaded successfully",
      eventImageUrl: eventImageUrl
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router; 