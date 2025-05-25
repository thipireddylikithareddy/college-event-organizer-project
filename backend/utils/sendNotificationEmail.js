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

const SendNotificationEmail = async (recipients, event, organizerName) => {
    for (const recipient of recipients) {
        const mailOptions = {
            from: `"${organizerName || 'JNTUH Organizer'}" <${process.env.EMAIL_USER}>`,
            to: recipient.email,
            subject: `📢 Hello ${recipient.name}, check out the new event!`,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #2a7ae2;">🎉 Hello, ${recipient.name}!</h2>
                <p style="font-size: 16px; color: #333;">
                    You are invited to a new event organized by <strong>${organizerName || 'the JNTUH team'}</strong>! Here are the details:
                </p>
                <table style="width: 100%; margin: 10px 0; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">📅 Event Name:</td>
                        <td style="padding: 8px;">${event.eventName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">📝 Description:</td>
                        <td style="padding: 8px;">${event.description}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">📅 Date:</td>
                        <td style="padding: 8px;">${new Date(event.date).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">⏰ Time:</td>
                        <td style="padding: 8px;">${formatTimeWithAMPM(event.time)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">📍 Venue:</td>
                        <td style="padding: 8px;">
                            ${event.venue} 
                            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}" style="color: #2a7ae2; text-decoration: none;" target="_blank"> (Get Directions) </a>
                        </td>
                    </tr>
                </table>
                <p style="font-size: 16px;">
                    👉 <strong>Register here:</strong> 
                    <a href="${event.register}" style="color: #ffffff; background-color: #28a745; padding: 8px 16px; text-decoration: none; border-radius: 4px; display: inline-block;">Register Now</a>
                </p>
                <hr style="margin: 20px 0;">
                <p style="font-size: 14px; color: #777;">
                    If you have any questions, feel free to contact the organizer.
                </p>
            </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Email sent to ${recipient.email}`);
        } catch (err) {
            console.error(`❌ Failed to send email to ${recipient.email}:`, err);
        }
    }
};

const updateNotificationEmail = async (recipients, event, organizerName) => {
    for (const recipient of recipients) {
        const mailOptions = {
            from: `"${organizerName || 'JNTUH Organizer'}" <${process.env.EMAIL_USER}>`,
            to: recipient.email,
            subject: `🔔 Update: Changes to "${event.eventName}" event`,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #e67e22;">🔔 Hello, ${recipient.name}!</h2>
                <p style="font-size: 16px; color: #333;">
                    We wanted to let you know that there have been <strong>important updates</strong> to the event 
                    <strong>"${event.eventName}"</strong> organized by <strong>${organizerName || 'the JNTUH team'}</strong>.
                </p>
                <p style="font-size: 16px; color: #c0392b;">
                    Please review the updated details below:
                </p>
                <table style="width: 100%; margin: 10px 0; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">📅 Event Name:</td>
                        <td style="padding: 8px;">${event.eventName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">📝 Description:</td>
                        <td style="padding: 8px;">${event.description}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">📅 Date:</td>
                        <td style="padding: 8px;">${new Date(event.date).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">⏰ Time:</td>
                        <td style="padding: 8px;">${formatTimeWithAMPM(event.time)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">📍 Venue:</td>
                        <td style="padding: 8px;">
                            ${event.venue} 
                            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}" style="color: #2a7ae2; text-decoration: none;" target="_blank"> (Get Directions) </a>
                        </td>
                    </tr>
                </table>
                <p style="font-size: 16px;">
                    👉 <strong>Check updates and confirm your registration:</strong> 
                    <a href="${event.register}" style="color: #ffffff; background-color: #28a745; padding: 8px 16px; text-decoration: none; border-radius: 4px; display: inline-block;">View & Confirm</a>
                </p>
                <hr style="margin: 20px 0;">
                <p style="font-size: 14px; color: #777;">
                    If you have any questions or concerns, feel free to contact the organizer.
                </p>
            </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Update email sent to ${recipient.email}`);
        } catch (err) {
            console.error(`❌ Failed to send update email to ${recipient.email}:`, err);
        }
    }
};

const notifyEventEmail = async (recipients, event, organizerName) => {
    for (const recipient of recipients) {
        const mailOptions = {
            from: `"${organizerName || 'JNTUH Organizer'}" <${process.env.EMAIL_USER}>`,
            to: recipient.email,
            subject: `🎉 Hey ${recipient.name}, don’t miss "${event.eventName}"!`,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #2a7ae2;">🎉 Exciting News, ${recipient.name}!</h2>
                <p style="font-size: 16px; color: #333;">
                    We’re thrilled to announce an upcoming event hosted by 
                    <strong>${organizerName || 'the JNTUH team'}</strong>! Check out the details below:
                </p>
                <table style="width: 100%; margin: 10px 0; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">📅 Event Name:</td>
                        <td style="padding: 8px;">${event.eventName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">📝 Description:</td>
                        <td style="padding: 8px;">${event.description}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">📅 Date:</td>
                        <td style="padding: 8px;">${new Date(event.date).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">⏰ Time:</td>
                        <td style="padding: 8px;">${formatTimeWithAMPM(event.time)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">📍 Venue:</td>
                        <td style="padding: 8px;">
                            ${event.venue} 
                            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}" style="color: #2a7ae2; text-decoration: none;" target="_blank"> (Get Directions) </a>
                        </td>
                    </tr>
                </table>
                <p style="font-size: 16px; color: #16a085;">
                    🌟 Don’t miss out on this opportunity — spots are limited!
                </p>
                <p style="font-size: 16px;">
                    👉 <strong>Reserve your spot now:</strong> 
                    <a href="${event.register}" style="color: #ffffff; background-color: #28a745; padding: 10px 18px; text-decoration: none; border-radius: 4px; display: inline-block;">Register Here</a>
                </p>
                <p style="font-size: 14px; color: #888; margin-top: 10px;">
                    Already registered? You can safely ignore this message.
                </p>
                <hr style="margin: 20px 0;">
                <p style="font-size: 14px; color: #777;">
                    Feel free to share this event with friends who might be interested!
                    <br>
                    For any questions, reach out to the organizer.
                </p>
            </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Notification email sent to ${recipient.email}`);
        } catch (err) {
            console.error(`❌ Failed to send notification email to ${recipient.email}:`, err);
        }
    }
};




export { updateNotificationEmail, SendNotificationEmail, notifyEventEmail };