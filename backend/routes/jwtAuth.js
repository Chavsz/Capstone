const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

//registering

router.post("/register", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body (name, email, password, role)
    const { name, email, password, role } = req.body;

    //2. check if user exists (if user exists, throw error)
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).send("User already exists");
    }

    //3. Only allow tutor or student roles
    if (!['tutor','student','admin'].includes(role)) {
      return res.status(401).send("Role must be either tutor, student or admin");
    }

    //4. bcrypt the user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    //5. enter the user into the database
    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password, user_role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, bcryptPassword, role]
    );

    //6. generate jwt token (include role)
    const token = jwtGenerator(newUser.rows[0].user_id, newUser.rows[0].user_role);

    res.json({ token, role: newUser.rows[0].user_role });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//login route
router.post("/login", validInfo, async (req, res) => {
  try {
    //1. destructure the req.body
    const { email, password } = req.body;

    //2. check if user doesn't exist (if not, throw error)
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Password or Email is incorrect");
    }

    //3. check if incoming password is the same as the database password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }

    //4. Only allow login for tutor or student
    if (!['tutor', 'student','admin'].includes(user.rows[0].user_role)) {
      return res.status(403).json("Login not allowed for this role");
    }

    //5. give the user the jwt token (include role)
    const token = jwtGenerator(user.rows[0].user_id, user.rows[0].user_role);

    res.json({ token, role: user.rows[0].user_role });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//verify token
router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
