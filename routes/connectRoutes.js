import express from 'express';

const router = express.Router();

import connectDB from '../config/db.js';

router.get('/check-db-connection', async (req, res) => {
    try {
        await connectDB(); // Call your connectDB function
        res.status(200).json({ message: 'Database connected successfully' });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ error: 'Failed to connect to the database' });
    }
});

export default router; 
