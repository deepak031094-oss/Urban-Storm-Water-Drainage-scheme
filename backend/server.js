require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const { createDefaultUser } = require('./models/User');

const app = express();

/* -------------------- MongoDB -------------------- */
mongoose
  .connect(
    process.env.MONGODB_URI || 'mongodb://mongo:27017/urban_storm_portal',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Connected to MongoDB');
    createDefaultUser();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

/* -------------------- Middleware -------------------- */
app.use(
  cors({
    origin: 'http://localhost:3000', // React dev server
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

/* -------------------- Routes -------------------- */
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

/* -------------------- Error Handler -------------------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

/* -------------------- Server -------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
