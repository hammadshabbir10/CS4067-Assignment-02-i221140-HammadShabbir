
const userPool = require("../../../user-service/db");
const bookingPool = require("../config/db");

const axios = require("axios");
async function processPayment(user_id, event_id, amount) {
    console.log(`🔄 Initiating payment for User ID: ${user_id}, Event ID: ${event_id}, Amount: ${amount}`);

    // ✅ Explicitly convert amount to an integer
    const numericAmount = parseInt(amount, 10);
    if (isNaN(numericAmount) || numericAmount <= 0) {
        console.error("❌ Error: Invalid amount value!", amount);
        return { success: false, user_email: null };
    }

    try {
        // Step 1: Store Payment in DB as PENDING
        const insertQuery = `INSERT INTO payments (user_id, event_id, amount, status) 
                             VALUES ($1, $2, $3, 'PENDING') RETURNING *`;
        const values = [user_id, event_id, numericAmount]; 
        const { rows } = await bookingPool.query(insertQuery, values);
        const payment_id = rows[0].id;

        console.log(`✅ Payment inserted with ID: ${payment_id}, Amount: ${numericAmount}`);

        // Step 2: Call Payment API
        console.log("🔄 Sending payment request:", { user_id, amount: numericAmount });

        const response = await axios.post("http://localhost:5002/api/payments", { user_id, amount: numericAmount });

        if (!response.data.success) {
            console.error("❌ Payment failed!");
            await bookingPool.query(`UPDATE payments SET status = 'FAILED' WHERE id = $1`, [payment_id]);
            return { success: false, user_email: null };
        }

        // Step 3: Fetch user email
        const userQuery = `SELECT email FROM users WHERE id = $1`;
        const userResult = await userPool.query(userQuery, [user_id]);

        if (userResult.rows.length === 0) {
            console.error("❌ User email not found!");
            return { success: false, user_email: null };
        }

        const user_email = userResult.rows[0].email;

        // Step 4: Update payment status to SUCCESSFUL
        await bookingPool.query(`UPDATE payments SET status = 'SUCCESSFUL' WHERE id = $1`, [payment_id]);
        console.log("✅ Payment successful and recorded in DB.");

        return { success: true, user_email };

    } catch (error) {
        console.error("❌ Payment processing error:", error.message);
        return { success: false, user_email: null };
    }
}


module.exports = { processPayment};

/*
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  },
  */