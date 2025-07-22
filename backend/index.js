require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

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

app.get("/users", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get users by role route

app.get("/users/:role", async (req, res) => {
  try {
    const { role } = req.params;
    const users = await pool.query("SELECT * FROM users WHERE user_role = $1", [
      role,
    ]);
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//delete user 

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
    res.json("User was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

//switch user role 
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const updateUser = await pool.query("UPDATE users SET user_role = $1 WHERE user_id = $2", [role, id]);
    res.json("User role was updated");
  } catch (err) {
    console.error(err.message);
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
  }
});

//landingpage
app.use("/landing", require("./routes/landing"));

//eventpage
app.use("/event", require("./routes/event"));

//appointmentpage
app.use("/appointment", require("./routes/appointment"));

//announcementpage
app.use("/announcement", require("./routes/announcement"));

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
