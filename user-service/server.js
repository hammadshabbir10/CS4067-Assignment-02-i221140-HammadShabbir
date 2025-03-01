const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const { createUserTable } = require("./models/userModel");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Ensure the database table is created before starting the server
(async () => {
  await createUserTable();
})();

// Routes
app.use("/api", userRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Handle uncaught errors
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});
