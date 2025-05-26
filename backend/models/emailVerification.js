import mongoose from "mongoose";

const emailVerificationSchema = new mongoose.Schema({
    email: String,
    code : String,
    expiry: Date,
});

export default mongoose.model('EmailVerification', emailVerificationSchema);