const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to Database
connectDB();

// Routes
app.use("/events", eventRoutes);

// Start Server
const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Event Service running on port ${PORT}`));
