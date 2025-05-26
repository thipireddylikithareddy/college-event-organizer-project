import dotenv from 'dotenv';
dotenv.config();
import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import emailVerificationRoutes from './routes/emailVerificationRoutes.js';

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

app.get('/', (request, response) => {
    return response.status(234).send("Hello");
});

app.use('/api/user', userRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/verify", emailVerificationRoutes);

mongoose
.connect(mongoDBURL)
.then(() => {
    console.log('App connected to databse');
    app.listen(PORT, () => {
    console.log(`App is listening to port: ${PORT}`)
})
})
.catch((error) => {
    console.log(error);
});
