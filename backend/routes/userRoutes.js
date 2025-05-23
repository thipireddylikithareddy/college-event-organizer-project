import express, { request, response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();
const JWT_SECRET = "myjwttoken784";

router.post('/register', async(request, response) => {
    const { name, email, password, role } = request.body;
    const userExists = await User.findOne({ email });
    if(userExists)
        return response.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    response.status(201).json({ message: 'User registered' });
});

router.post('/login', async(request, response) => {
    const {email, password} = request.body;

    const user = await User.findOne({ email });
    if(!user)
        return response.status(400).json({ message: 'User does not exist' });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch)
        return response.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id:user._id, role: user.role }, JWT_SECRET, {expiresIn: '1h'});
    
    response.json({
        token,
        role: user.role,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        }
    });
});

export default router;