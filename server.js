// DEPENDENCIES
const express = require("express")
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const db = mongoose.connection;
const session = require('express-session');

// Middleware
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    }));

// Routes / Controllers
const userController = require('./controllers/controller.user');
app.use('/users', userController);

// Routes / Controllers //Configure Sessions Controller as Middleware
const sessionsController = require('./controllers/sessions');
app.use('/sessions', sessionsController);

// Database Configuration
mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

// Database Connection Error / Success
db.on("error", (err) => console.log(err.message + "is mongod not running?"));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));


// LISTENER
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));
