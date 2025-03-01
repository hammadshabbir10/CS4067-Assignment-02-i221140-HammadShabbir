const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://localhost";
const QUEUE_NAME = "booking_confirmations";

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log("✅ Connected to RabbitMQ");
        return channel;
    } catch (error) {
        console.error("❌ RabbitMQ Connection Error:", error);
        return null;
    }
}

module.exports = { connectRabbitMQ, QUEUE_NAME };
