import 'dotenv/config';
import nodemailer from 'nodemailer';

const formatTimeWithAMPM = (time24) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const SendNotificationEmail = async (recipients, event) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipients, // an array of emails
        subject: `New Event: ${event.eventName}`,
        html: `
      <h2>${event.eventName}</h2>
      <p><strong>Date:</strong> ${event.date}</p>
      <p><strong>Time:</strong> ${formatTimeWithAMPM(event.time)}</p>
      <p><strong>Venue:</strong> ${event.venue} <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}" target="_blank"> ( Get Directions ) </a> </p>
      <p><strong>Register:</strong><a href="${event.register}"> Register Here </a></p>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Emails sent to participants.");
    } catch (err) {
        console.error("Failed to send emails:", err);
    }
};

export { SendNotificationEmail };