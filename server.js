// Import required modules
var express = require('express');
var dotenv = require('dotenv').config(); // Load environment variables from .env file
var ejs = require('ejs');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

// Initialize Express app
var app = express();

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sneha_007:YJvLR5qGrpKJwLNV@registration.4drno.mongodb.net/';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.error('Error in DB connection:', err.message);
  }
});

var db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', () => {
  console.log('MongoDB connection is open.');
});

// Configure session
app.use(session({
  secret: process.env.SESSION_SECRET || 'work hard', // Secret stored in .env for security
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// Middleware for views and static files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views'))); // Use static path for compatibility

// Routes
var index = require('./routes/index');
app.use('/', index);

// 404 error handler
app.use((req, res, next) => {
  var err = new Error('File Not Found');
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
  console.log(`Server is started on http://127.0.0.1:${PORT}`);
});
