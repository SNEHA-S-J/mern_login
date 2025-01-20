// Import required modules
const express = require('express');
const dotenv = require('dotenv').config(); // Load environment variables from .env file
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Updated syntax for connect-mongo

// Initialize Express app
const app = express();

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sneha_007:YJvLR5qGrpKJwLNV@registration.4drno.mongodb.net/';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connection Succeeded.'))
  .catch(err => console.error('Error in DB connection:', err.message));

// Configure session
app.use(session({
  secret: process.env.SESSION_SECRET || 'work hard', // Use secret from environment variables
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI, // Modern syntax for connect-mongo
    collectionName: 'sessions' // Optional: Customize the session collection name
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Secure cookies in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Middleware for views and static files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views'))); // Serve static files from views directory

// Routes
const index = require('./routes/index');
app.use('/', index);

// 404 error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
