const pool = require("../config/db");

async function createBooking(user_id, event_id, tickets) {
    try {
        const query = `INSERT INTO bookings (user_id, event_id, tickets, status) 
                       VALUES ($1, $2, $3, 'CONFIRMED') RETURNING *`;
        const values = [user_id, event_id, tickets];

        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (dbError) {
        console.error("❌ Database error in createBooking:", dbError);
        throw new Error("Database error");
    }
}



async function processPayment(user_id, event_id, amount) {
    try {
        console.log(`🔄 Initiating payment for User ID: ${user_id}, Event ID: ${event_id}, Amount: $${amount}`);

        // Step 1: Store Payment in DB as PENDING
        const insertQuery = `INSERT INTO payments (user_id, event_id, amount, status) 
                             VALUES ($1, $2, $3, 'PENDING') RETURNING *`;
        const values = [user_id, event_id, amount];
        const { rows } = await pool.query(insertQuery, values);
        const payment_id = rows[0].id;

        // Step 2: Call Payment API
        const response = await axios.post("http://localhost:5002/api/payments", { user_id, amount });

        if (!response.data.success) {
            console.error("❌ Payment failed!");

            // Update status to FAILED
            await pool.query(`UPDATE payments SET status = 'FAILED' WHERE id = $1`, [payment_id]);
            return { success: false, user_email: null }; // ❌ Payment failed
        }

        // Step 3: Fetch user email from the database
        const userQuery = `SELECT email FROM users WHERE id = $1`;
        const userResult = await pool.query(userQuery, [user_id]);

        if (userResult.rows.length === 0) {
            console.error("❌ User email not found!");
            return { success: false, user_email: null };
        }

        const user_email = userResult.rows[0].email;

        // Step 4: Update payment status to SUCCESSFUL
        await pool.query(`UPDATE payments SET status = 'SUCCESSFUL' WHERE id = $1`, [payment_id]);
        console.log("✅ Payment successful and recorded in DB.");

        return { success: true, user_email }; // ✅ Return user email

    } catch (error) {
        console.error("❌ Payment processing error:", error.message);
        return { success: false, user_email: null };
    }
}

module.exports = { createBooking, processPayment };
