require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const authorization = require("./middleware/authorization");
const { autoDeclinePendingAppointments, checkEndedAppointments } = require("./routes/appointment");

//middleware

app.use(express.json()); //req.body
app.use(cors());

// Serve static files from the public directory
app.use('/uploads', express.static('public/uploads'));

//Routes//

//Register and Login Routes

app.use("/auth", require("./routes/jwtAuth"));

//dashboard route

app.use("/dashboard", require("./routes/dashboard"));

//upload route

app.use("/upload", require("./routes/upload"));

//get all users route

app.get("/users", authorization, async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//get tutors with profile information (must come before /users/:role)
app.get("/users/tutor", async (req, res) => {
  try {
    const users = await pool.query(`
      SELECT u.user_id, u.name, u.email, u.role, p.program, p.college, p.year_level, p.subject, p.specialization, p.profile_image, p.online_link
      FROM users u
      LEFT JOIN profile p ON u.user_id = p.user_id
      WHERE u.role = 'tutor'
    `);
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//get users by role route

app.get("/users/:role", authorization, async (req, res) => {
  try {
    const { role } = req.params;
    const users = await pool.query("SELECT * FROM users WHERE role = $1", [
      role,
    ]);
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//delete user 

app.delete("/users/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
    res.json("User was deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//switch user role 
app.put("/users/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const updateUser = await pool.query("UPDATE users SET role = $1 WHERE user_id = $2", [role, id]);
    res.json("User role was updated");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//get tutor details

app.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tutor = await pool.query("SELECT * FROM profile WHERE user_id = $1", [id]);
    res.json(tutor.rows);
  } catch (err) { 
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//landingpage
app.use("/landing", require("./routes/landing"));

//eventpage
app.use("/event", require("./routes/event"));

//appointmentpage
app.use("/appointment", require("./routes/appointment").router);

//announcementpage
app.use("/announcement", require("./routes/announcement"));

// Set up scheduled job to check for auto-decline every hour
setInterval(async () => {
  await autoDeclinePendingAppointments();
}, 60 * 60 * 1000); // Run every hour (60 minutes * 60 seconds * 1000 milliseconds)

// Set up scheduled job to check for ended appointments every minute
setInterval(async () => {
  await checkEndedAppointments();
}, 60 * 1000); // Run every minute (60 seconds * 1000 milliseconds)

// Run checks immediately on server start
autoDeclinePendingAppointments();
checkEndedAppointments();

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
