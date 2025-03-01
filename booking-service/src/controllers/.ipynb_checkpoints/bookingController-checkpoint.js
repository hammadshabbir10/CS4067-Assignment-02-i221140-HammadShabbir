/*const pool = require("../config/db"); // PostgreSQL connection
const Event = require("../models/eventModel"); // MongoDB Event Model
const { createBooking } = require("../models/bookingModel");
const { connectRabbitMQ, QUEUE_NAME } = require("../config/rabbitmq");

async function bookEvent(req, res) {
    const { user_id, event_id, tickets } = req.body;

    try {
        // ✅ **Step 1: Check User Exists in PostgreSQL**
        const userQuery = `SELECT email FROM users WHERE id = $1`;
        const userResult = await pool.query(userQuery, [user_id]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "User does not exist!" });
        }

        const user_email = userResult.rows[0].email; // Fetch user email

        // ✅ **Step 2: Check Event Exists in MongoDB**
        const eventExists = await Event.findById(event_id);
        if (!eventExists) {
            return res.status(400).json({ message: "Event does not exist!" });
        }

        // ✅ **Step 3: Store Booking in PostgreSQL**
        const booking = await createBooking(user_id, event_id, tickets);

        // ✅ **Step 4: Publish Event to RabbitMQ**
        const channel = await connectRabbitMQ();
        if (channel) {
            const message = JSON.stringify({
                booking_id: booking.id,
                user_email: user_email,
                status: "CONFIRMED"
            });

            channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true });
            console.log(`📩 Booking event sent to RabbitMQ: ${message}`);
        }

        res.status(201).json({ message: "Booking created successfully", booking });

    } catch (error) {
        console.error("Error in booking:", error);
        res.status(500).json({ message: "Error creating booking", error });
    }
}

module.exports = { bookEvent };
*/

const pool = require("../config/db"); // PostgreSQL connection
const Event = require("../../../event-service/models/eventModel");
const { createBooking } = require("../models/bookingModel");
const { connectRabbitMQ, QUEUE_NAME } = require("../config/rabbitmq");
const axios = require("axios");

const fetchEvent = async (eventId) => {
    try {
        const response = await axios.get(`http://localhost:5001/events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching event:", error.message);
        throw new Error("Event not found");
    }
};

async function fetchUser(user_id) {
    try {
        const response = await axios.get(`http://localhost:5000/api/users/${user_id}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching user:", error);
        return null;
    }     
}

async function bookEvent(req, res) {
    const { user_id, event_id, tickets } = req.body;

    try {
        // ✅ **Step 1: Validate Input**
        if (!user_id || !event_id || !tickets || tickets <= 0) {
            return res.status(400).json({ message: "Invalid input data!" });
        }

        // ✅ **Step 2: Check if User Exists in PostgreSQL**
        /*const userQuery = `SELECT email FROM users WHERE id = $1`;
        const userResult = await pool.query(userQuery, [user_id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User does not exist!" });
        }
        
        const user_email = userResult.rows[0].email; // Fetch user email
    
        */

            // ✅ Step 2: Fetch User from User Service
        const userExists = await fetchUser(user_id);

        if (!userExists) {
            return res.status(404).json({ message: "User does not exist!" });
        }

        const user_email = userExists.email; // Get user email

        // ✅ **Step 3: Check if Event Exists in MongoDB**
        const eventExists = await fetchEvent(event_id);
        if (!eventExists) {
            return res.status(404).json({ message: "Event does not exist!" });
        }

        // ✅ **Step 4: Check Ticket Availability**
        if (eventExists.availableTickets < tickets) {
            return res.status(400).json({ message: "Not enough tickets available!" });
        }

        // ✅ **Step 5: Create Booking in PostgreSQL**
        const booking = await createBooking(user_id, event_id, tickets);

        // ✅ **Step 6: Update Ticket Count in MongoDB**
        /*await axios.patch(`http://localhost:5001/events/${event_id}, {
            availableTickets: eventExists.availableTickets - tickets
        });*/

        // ✅ **Step 7: Publish Booking Event to RabbitMQ**
        try {
            const channel = await connectRabbitMQ();
            if (channel) {
                const message = JSON.stringify({
                    booking_id: booking.id,
                    user_email: user_email,
                    event_id: event_id,
                    status: "CONFIRMED"
                });
        
                channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true });
                console.log(`📩 Booking event sent to RabbitMQ: ${message}`);
            }
        } catch (rabbitError) {
            console.error("❌ RabbitMQ error:", rabbitError);
        }
        
        res.status(201).json({ message: "Booking created successfully", booking });

    } catch (error) {
        console.error("❌ Error in booking:", error);
        res.status(500).json({ message: "Error creating booking", error });
    }
}

module.exports = { bookEvent };

