const amqp = require("amqplib");
const { sendEmail } = require("./emailService");

const RABBITMQ_URL = "amqp://localhost"; // 🔴 Your RabbitMQ URL
const QUEUE_NAME = "booking_confirmations";       // 🔴 Use the same queue name as Booking Service

const consumeMessages = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log("📩 Waiting for messages in queue...");

        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                const bookingData = JSON.parse(msg.content.toString());
                console.log("📩 Booking event received:", bookingData);

                const { user_email, event_id } = bookingData;

                if (user_email && event_id) {
                    await sendEmail(user_email, event_id);
                    console.log(`✅ Email sent to ${user_email}`);
                }

                channel.ack(msg); // Acknowledge message after processing
            }
        });

    } catch (error) {
        console.error("❌ RabbitMQ Consumer Error:", error);
    }
};

// Start consuming messages
consumeMessages();
