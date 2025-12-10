import dotenv from 'dotenv';
import app from '../server.js';

// Load environment variables
dotenv.config();

// Export Express app directly for Vercel
module.exports = app;
