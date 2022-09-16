// DEPENDENCIES
const express = require("express")
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const db = mongoose.connection;
const methodOverride = require("method-override");
const session = require('express-session');

// Middleware
// Body parser middleware: give us access to req.body
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));

// Middleware Configure Express Sessions

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    }));

// Routes / Controllers
const userController = require('./controllers/controller.user');
app.use('/users', userController);

const recipesController = require('./controllers/controller.recipes');
app.use('/recipes', recipesController);

// Routes / Controllers //Configure Sessions Controller as Middleware
const sessionsController = require('./controllers/sessions');
app.use('/sessions', sessionsController);

// Routes / Controllers Index View
app.get('/', (req, res) => {
	res.render('index.ejs', {
		currentUser: req.session.currentUser
	});
});

// Routes . Render The Dashboard View
app.get('/', (req, res) => {
	if (req.session.currentUser) {
		res.render('dashboard.ejs', {
			currentUser: req.session.currentUser
		});
	} else {
		res.render('index.ejs', {
			currentUser: req.session.currentUser
		});
	}
});

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
