/*const pool = require("../config/db"); // PostgreSQL connection
const { createBooking } = require("../models/bookingModel");
const { connectRabbitMQ, QUEUE_NAME } = require("../config/rabbitmq");
const axios = require("axios");

// Fetch Event from Event Service
const fetchEvent = async (eventId) => {
    try {
        const response = await axios.get(`http://localhost:5001/events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching event:", error.message);
        throw new Error("Event not found");
    }
};

// Fetch User from User Service
const fetchUser = async (user_id) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/users/${user_id}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching user:", error);
        return null;
    }     
};

// ✅ Process Payment Before Confirming Booking
const processPayment = async (user_id, amount) => {
    try {
        const response = await axios.post("http://localhost:5002/api/payments", {
            user_id,
            amount
        });

        return response.data.success; // Returns `true` if payment successful
    } catch (error) {
        console.error("❌ Payment failed:", error.message);
        return false;
    }
};

async function bookEvent(req, res) {
    const { user_id, event_id, tickets } = req.body;

    try {
        // ✅ **Step 1: Validate Input**
        if (!user_id || !event_id || !tickets || tickets <= 0) {
            return res.status(400).json({ message: "Invalid input data!" });
        }

        // ✅ **Step 2: Fetch User**
        const userExists = await fetchUser(user_id);
        if (!userExists) {
            return res.status(404).json({ message: "User does not exist!" });
        }
        const user_email = userExists.email; 

        // ✅ **Step 3: Fetch Event**
        const eventExists = await fetchEvent(event_id);
        if (!eventExists) {
            return res.status(404).json({ message: "Event does not exist!" });
        }

        // ✅ **Step 4: Check Ticket Availability**
        if (eventExists.availableTickets < tickets) {
            return res.status(400).json({ message: "Not enough tickets available!" });
        }

        // ✅ **Step 5: Calculate Payment Amount**
        const amount = tickets * eventExists.ticketPrice; // Assuming `ticketPrice` exists

        // ✅ **Step 6: Process Payment via Payment Gateway**
       

            const paymentSuccess = await processPayment(user_id, amount);
            if (!paymentSuccess) {
                return res.status(400).json({ message: "Payment failed!" });
            }
        

        // ✅ **Step 7: Create Booking in PostgreSQL**
        const booking = await createBooking(user_id, event_id, tickets);

        // ✅ **Step 8: Publish Booking Event to RabbitMQ**
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

*/
const pool = require("../config/db"); // PostgreSQL connection
const { createBooking } = require("../models/bookingModel");
const { processPayment } = require("../models/paymentModel"); // Import payment processing
const { connectRabbitMQ, QUEUE_NAME } = require("../config/rabbitmq");

const axios = require("axios");

// Fetch Event from Event Service
const fetchEvent = async (eventId) => {
    try {
        const response = await axios.get(`http://localhost:5001/events/${eventId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching event:", error.message);
        throw new Error("Event not found");
    }
};

// Fetch User from User Service
const fetchUser = async (user_id) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/users/${user_id}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching user:", error);
        return null;
    }     
};


async function bookEvent(req, res) {
    const { user_id, event_id, tickets } = req.body;

    try {
        // ✅ Step 1: Validate Input
        if (!user_id || !event_id || !tickets || tickets <= 0) {
            return res.status(400).json({ message: "Invalid input data!" });
        }

        // ✅ Step 2: Fetch User
        const userExists = await fetchUser(user_id);
        if (!userExists) {
            return res.status(404).json({ message: "User does not exist!" });
        }
    
        // ✅ Step 3: Fetch Event
        const eventExists = await fetchEvent(event_id);
        if (!eventExists) {
            return res.status(404).json({ message: "Event does not exist!" });
        }

        // ✅ Step 4: Check Ticket Availability
        if (eventExists.availableTickets < tickets) {
            return res.status(400).json({ message: "Not enough tickets available!" });
        }

        // ✅ Step 5: Process Payment Before Booking
        const totalAmount = parseInt(50, 10) * parseInt(tickets, 10);
        console.log("tickets:", tickets);
        console.log("totalAmount before passing:", totalAmount);
        console.log("Type of tickets:", typeof tickets);
        console.log("Type of totalAmount:", typeof totalAmount);

        const { success, user_email } = await processPayment(user_id, event_id, totalAmount);

        if (!success) {
            return res.status(400).json({ message: "Payment failed! Please try again." });
        }

        // ✅ Step 6: Create Booking in PostgreSQL
        const booking = await createBooking(user_id, event_id, tickets);

        // ✅ Step 7: Publish Booking Event to RabbitMQ
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
