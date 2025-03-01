const express = require("express");
const bodyParser = require("body-parser");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
app.use(bodyParser.json());
app.use("/api", bookingRoutes);

app.post("/api/payments", async (req, res) => {
    let { user_id, amount } = req.body;

    // ✅ Ensure amount is an integer
    amount = parseInt(amount, 10);
    if (!user_id || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ success: false, message: "Invalid payment details!" });
    }

    console.log(`💳 Processing payment of ${amount} for User ID: ${user_id}`);

    // Simulating Payment Success
    return res.status(200).json({ success: true, message: "Payment successful!" });
});

module.exports = app;
