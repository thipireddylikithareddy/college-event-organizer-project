import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const VerificationEmail = async(recipient, code) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: 'Your Verification code',
        text: `Your verification code is ${code}`
    }

    try{
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${recipient}`);
    }
    catch(err){
        console.error(`❌ Failed to send email to ${recipient}:`, err);
    }
};

export { VerificationEmail };