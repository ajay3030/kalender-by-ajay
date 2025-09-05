// backend/server.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const connectDB = require('./config/db');
const eventTypeRoutes = require('./routes/eventType');
const publicRoutes = require('./routes/public');

const app = express();
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/user', userRoutes);
app.use('/api/event-types', eventTypeRoutes);
app.use('/api/public', publicRoutes);

// Health-check route
app.get('/api', (_, res) => res.json({ msg: 'API running 🚀' }));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));