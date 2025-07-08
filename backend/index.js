const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware

app.use(express.json()); //req.body
app.use(cors());

//Routes//

//Register and Login Routes

app.use("/auth", require("./routes/jwtAuth"));

//dashboard route

app.use("/dashboard", require("./routes/dashboard"));

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

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
