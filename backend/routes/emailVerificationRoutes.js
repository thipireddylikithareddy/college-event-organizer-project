import express, { request, response } from 'express';
import EmailVerification from '../models/emailVerification.js';
import { VerificationEmail } from '../utils/verificationEmail.js';
import nodemailer from 'nodemailer'
import 'dotenv/config';

const router = express.Router();

router.post('/send', async (request, response) => {
    const { email } = request.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await EmailVerification.findOneAndUpdate(
        { email },
        { code, expiry },
        { upsert: true, new: true },
    );

    await VerificationEmail(email, code);
    response.json({ message: 'Verification code sent' });
});

router.post('/check', async(request, response) => {
    const { email, code } = request.body; 

    try {
    const record = await EmailVerification.findOne({ email });

    if (!record) {
      return response.status(400).json({ message: 'No code found for this email' });
    }

    if (record.code !== code) {
      return response.status(400).json({ message: 'Invalid code' });
    }

    if (record.expiry < new Date()) {
      return response.status(400).json({ message: 'Code expired' });
    }

    await EmailVerification.deleteOne({ email });

    response.json({ message: 'Email verified' });
  } catch (err) {
    console.error(err);
    response.status(500).json({ message: 'Error verifying code' });
  }
});

export default router;

