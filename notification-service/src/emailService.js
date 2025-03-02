const nodemailer = require("nodemailer");

// Replace with your SMTP credentials
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Change if using a different provider
    port: 587,
    secure: false,
    auth: {
        user: "hammadshabbir1015@gmail.com", // Replace with your email
        pass: "chklrehwtazfwfll"   // Replace with your email password
    }
});

const sendEmail = async (to, bookingId) => {
    const mailOptions = {
        from: "your_email@gmail.com", // Replace with sender's email
        to: to, // Receiver's email from RabbitMQ message
        subject: "Booking Confirmation",
        text: `Your booking with ID ${bookingId} has been confirmed.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${to}`);
    } catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error);
    }
};

module.exports = { sendEmail };
