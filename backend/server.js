// backend/server.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const connectDB = require('./config/db');

const app = express();
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health-check route
app.get('/api', (_, res) => res.json({ msg: 'API running 🚀' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));