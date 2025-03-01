const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "MySuperSecretKey123"; // Hardcoded JWT secret (not recommended for production)

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `;
  try {
    await pool.query(query);
    console.log("User table ready");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
};

// Add a new user (with hashed password)
const addUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10); // Hash password before storing
  const query = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
  const values = [name, email, hashedPassword];

  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error("Error inserting user:", err);
    throw new Error("Database error while inserting user");
  }
};

// Get all users (excluding passwords)
const getUsers = async () => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users");
    return result.rows;
  } catch (err) {
    console.error("Error fetching users:", err);
    throw new Error("Database error while fetching users");
  }
};

// User Login Function
const loginUser = async (email, password) => {
  const query = "SELECT * FROM users WHERE email = $1";
  
  try {
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
      throw new Error("Invalid email or password");
    }

    const user = result.rows[0];

    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return { token, user: { id: user.id, name: user.name, email: user.email } };
  } catch (err) {
    console.error("❌ Login error:", err);
    throw new Error(err.message);
  }
};

const getUserById = async (id) => {
  const query = "SELECT id, name, email FROM users WHERE id = $1::int"; // Force integer

  try {
    console.log(`🔍 Searching for user with ID: ${id}`);
    const result = await pool.query(query, [parseInt(id, 10)]); // Ensure it's an integer

    if (result.rows.length === 0) {
      console.log("❌ No user found");
      return null;
    }

    console.log("✅ User found:", result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error("❌ Error fetching user by ID:", err);
    throw new Error("Database error while fetching user");
  }
};

module.exports = { createUserTable, addUser, getUsers, loginUser,getUserById };
