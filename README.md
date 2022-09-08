# MEEN Auth Template Build - Part 1

As a Junior Developer, User Authentication is something you really shouldn't be working on just yet. But having some experince with it, and building projects with authentication looks really good on your resume and portfolio.

So, today we're going to build a template repo which will allow you to get up and running with Authenticatication without having to build it out every time you want to create a portfolio project with it.

And if you do want to code it out on your own, this template repo will provide great reference code as you do so!




Here's what we're going to create:

example functionality




# Set Up

Note: Your default branch on github might be set to 'main' if you want to make sure it's the same everywhere to avoid branching issues before we learn about branching, navigate to https://github.com/settings/repositories and change your default branch to master

On github.com NOT GHE, create a new repo called meen-auth-starter with a node .gitignore \
You may already have a global .gitignore configured, but it never hurts to have a local one, and if someone else wants to use your template, they'll be all set up with the proper files ignored.

Clone that repo down to your computer
cd meen-auth-starter
touch server.js
npm init -y
npm install express express-session bcrypt dotenv mongoose ejs method-override
touch .env



# Add ENV Variables

In .env:

 PORT=3000
DATABASE_URL=mongodb+srv://<username>:<password>@general-assembly.1wjse.mongodb.net/meen-auth-starter?retryWrites=true&w=majority
SECRET=feedmeseymour
Remember to use your own DATABASE_URL. Copying the one above will not work. \
Remember your SECRET should be a totally random string. This matters less in development, but it'll be important when you deploy your apps and have to add the variable to Heroku.



# Create a Basic Express Server

In server.js:

 // Dependencies
const express = require('express');
const app = express();
require('dotenv').config();

// Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`));



# Configure the Database

In server.js:

 // Dependencies 
const mongoose = require('mongoose');

// Database Configuration
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

// Database Connection Error / Success
const db = mongoose.connection;
db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));



STOP! Check your work.

Boot up your server. You should see:

 server is listening on port: 3000
mongo connected



# User Stories

AAU I should be able to navigate to a registration page and create an account
AAU I should be able to navigate to a login page and login to my account
AAU I should be able to navigate to a protected dashboard page when logged in
AAU I should be redirected to the login page if I try to access the dashboard when logged out
AAU I should be able to log out of my account



# Create the User Model

mkdir models
touch models/user.js
In models/user.js:

 // Dependencies 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const userSchema = Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

// User Model
const User = mongoose.model('User', userSchema);

// Export User Model
module.exports = User;



# Create Users Controller

mkdir controllers
touch controllers/users.js



# Configure Users Controller as Middleware

Let's just take care of this now so it doesn't go forgotten. 
While we're here, let's also configure our body-parser middleware, since we're about to begin working with req.body




In server.js:

 // Middleware
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }));

// Routes / Controllers
const userController = require('./controllers/users');
app.use('/users', userController);



# Add Dependencies to User Controller and Export Router

While we're here, let's also add some comments to remind ourselves which routes we'll need in this file. Remember INDUCES (Index, new, delete, update, create, edit, show) to help organize your routes and prevent conflicts.




In controllers/users.js:

 // Dependencies
const bcrypt = require('bcrypt');
const express = require('express');
const userRouter = express.Router();
const User = require('../models/user.js');

// New (registration page)

// Create (registration route)

// Export User Router
module.exports = userRouter;



# Create Registration Route (Create / POST)

Before we do too much at once, let's just see if we can successfully hash the user's password.

In controllers/users.js:

 userRouter.post('/', (req, res) => {
    //overwrite the user password with the hashed password, then pass that in to our database
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    res.send(req.body);
});

STOP! Check your work with postman


Add an email and password (don't use any of your real passwords incase you need to share your screen) 
Has your password been hashed? Yes? Awesome! No? Take a moment to debug.




# Update Registration route to Create a User in the Database

In controllers/users.js:

 // Create (registration route)
userRouter.post('/', (req, res) => {
    //overwrite the user password with the hashed password, then pass that in to our database
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    User.create(req.body, (error, createdUser) => {
        res.send(createdUser);
    });
});
STOP! Check your work with Postman. This time, you should get back a MongoDB Entry




# Touch Up The Registration Route to Redirect to the Index Page

In controllers/users.js:

 // Create (registration route)
userRouter.post('/', (req, res) => {
    //overwrite the user password with the hashed password, then pass that in to our database
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    User.create(req.body, (error, createdUser) => {
        res.redirect('/');
    });
});



# Configure Express Sessions

In server.js:

 // Dependencies 
const session = require('express-session');

// Middleware
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    }));
We've already added the SECRET variable to our .env file, so we should be good to go!




# Create Sessions Controller

Login (session creation)/ Logout (session destruction) functionaliy will be handled with express-session, so we'll have a separate controller for that.

touch controllers/sessions.js



Configure Sessions Controller as Middleware

Let's just take care of this now so it doesn't go forgotten.

In server.js:

 // Routes / Controllers
const sessionsController = require('./controllers/sessions');
app.use('/sessions', sessionsController);



# Require Dependencies in Sessions Controller

While we're here, let's also add some comments to remind ourselves which routes we'll need in this file. Remember INDUCES!

In controllers/sessions.js:

 // Dependencies
const express = require('express');
const bcrypt = require('bcrypt');
const sessionsRouter = express.Router();
const User = require('../models/user.js');

// New (login page)

// Delete (logout route)

// Create (login route)

// Export Sessions Router
module.exports = sessionsRouter;



# Create Login Route (Create / POST)

Before we start coding, let's think this through a bit.

When a user tries to login, we need to check a few things.

First we want to check if the user exists in our database
If the user doesn't exist, return an error
If the user exists...
Compare the password they provided with the hashed password we have stored in the database
If the passwords don't match, return an error and ask the user to try again
If the passwords do match...
Create a new express session for the user (log them in)
Alright, let's baby step this!




# In controllers/sessions.js:

 // Create (login route)
sessionsRouter.post('/', (req, res) => {
    // Check for an existing user
    User.findOne({
        email: req.body.email
    }, (error, foundUser) => {
        // send error message if no user is found
        if (!foundUser) {
            res.send(`Oops! No user with that email address has been registered.`);
        } else {
            // If a user has been found 
            // compare the given password with the hashed password we have stored
            const passwordMatches = bcrypt.compareSync(req.body.password, foundUser.password);

            // if the passwords match
            if (passwordMatches) {
                // add the user to our session
                req.session.currentUser = foundUser;

                // redirect back to our home page
                res.redirect('/');
            } else {
                // if the passwords don't match
                res.send('Oops! Invalid credentials.');
            }
        }
    });
});



STOP! We have a lot of work to check.


# Let's do so with Postman:

Create a POST request to http://localhost:3000/sessions
Use an INCORRECT email address and an INCORRECT password to login \
You should see Oops! No user with that email address has been registered.

Now use the CORRECT email address and an INCORRECT password \
You should see Oops! Invalid credentials.

Now use the CORRECT email address and the CORRECT password \



This should redirect you to the index page. We don't yet have anything at that index route, so you should see:

 <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Error</title>
</head>

<body>
    <pre>Cannot GET /</pre>
</body>

</html>


Perfect! Now we can register and login a user.

# Create a Logout Route (Destroy / Delete)

In controllers/sessions.js:

 // Delete (logout route)
sessionsRouter.delete('/', (req, res) => {
    req.session.destroy((error) => {
        res.redirect('/');
    });
})
Delete routes are often pretty easy. Here we're deleting the session and redirecting to the index page.

STOP! Check your work in Postman.

# Create a DELETE request to http://localhost:3000/sessions Once again, this should redirect you to the index page. We don't yet have anything at that index route, so you should see:

 <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Error</title>
</head>

<body>
    <pre>Cannot GET /</pre>
</body>

</html>


# MEEN Auth Template Build - Part 2
We've completed the core functionality for our app, but we still have some work to do. We still need:

Index View
Navigation Partial
Login View
Register View
Protected Dashboard View
Let's start of simple:


# Create The Index View

mkdir views
touch views/index.ejs
In views/index.ejs:

 <!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>

<body>
	<h1>Home</h1>
</body>

</html>



# Render the Index View

In server.js:

 // Routes / Controllers
app.get('/', (req, res) => {
	res.render('index.ejs');
});



# Create the Nav Partial

mkdir views/partials
touch views/partials/nav.ejs
In views/partials/nav.ejs:

 <nav>
	<a href="/">Home</a>
	<a href="/users/new">Register</a>
	<a href="/sessions/new">Login</a>
</nav>



# Update Index View to Render Nav Partial

In views/index.ejs:

 <!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>

<body>
	<%- include('./partials/nav.ejs')  %>
	<h1>Home Page</h1>
</body>

</html>



STOP! Check your work.
Navigate to http://localhost:3000/. You should see your nav links and your h1 tag.

# Create the Login View

mkdir views/sessions
touch views/sessions/new.ejs

In views/sessions/new.ejs:

 <!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>MEEN Auth Starter</title>
</head>

<body>
	<%- include('../partials/nav.ejs')  %>
	<h1>Login</h1>
	<form action='/sessions' method='POST'>
		<label for="email">Email:</label>
		<input type="email" name="email" id="email" />

		<label for="password">Password:</label>
		<input type="password" name="password" id="password" />

		<input type="submit" value="Login">
	</form>
</body>

</html>
If you copied and pasted this code over, remember the name attribute on the form inputs needs to be the same as the req.body field that form value will be filling.

The id attribute on the form inputs needs to match the for attribute on the labels.

# Render the Login View

Remember INDUCES!
In controllers/sessions.js:

 // New (login page)
sessionsRouter.get('/new', (req, res) => {
	res.render('sessions/new.ejs')
})
STOP! Check your work. We've already coded out the login functionality. Go ahead and try logging in from the browser. If it works, you should be redirected to the browser. If it doens't work, come off mute and let's debug!

# Create the Register View

mkdir views/users
touch views/users/new.ejs

In views/users/new.ejs:

 <!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>MEEN Auth Starter</title>
</head>

<body>
	<%- include('../partials/nav.ejs')  %>
	<h1>Register</h1>
	<form action='/users' method='POST'>
		<label for="email">Email:</label>
		<input type="email" name="email" id="email" />

		<label for="password">Password:</label>
		<input type="password" name="password" id="password" />

		<input type="submit" value="Register">
	</form>
</body>

</html>
If you copied and pasted this code over from the markdown or from your login page, remember to read through line by line to update it!




# Render the Registration View

Remember INDUCES!
In controllers/users.js:

 // New (registration page)
userRouter.get('/new', (req, res) => {
	res.render('users/new.ejs');
});

STOP! Check your work.


# Create a new user from the browser, using a new email address. 
If it works, you should be redirected to the index page.

Refactor Routes that Render Views to Include Current User Data

In controllers/sessions.js:

 // New (login page)
sessionsRouter.get('/new', (req, res) => {
	res.render('sessions/new.ejs', {
		currentUser: req.session.currentUser
	});
});


In controllers/users.js:

 // New (registration page)
userRouter.get('/new', (req, res) => {
	res.render('users/new.ejs', {
		currentUser: req.session.currentUser
	});
});
In server.js:

 app.get('/', (req, res) => {
	res.render('index.ejs', {
		currentUser: req.session.currentUser
	});
});



# Update Nav Partial with Conditional Rendering and Logout Button

In views/partials/nav.ejs:

 <nav>
	<% if(currentUser) { %>
		<a href="/">Home</a>
		<form action="/sessions?_method=DELETE" method="POST">
			<input type="submit" value="Log Out" />
		</form>
	<% } else { %>
		<a href="/">Home</a>
		<a href="/users/new">Register</a>
		<a href="/sessions/new">Login</a>
	<% } %>
</nav>



# Create a Logout Route

Remember INDUCES!

Inside of controllers/sessions.js, we can add:

 sessionsRouter.delete('/', (req, res) => {
  req.session.destroy((error) => {
    res.redirect('/');
  });
});



STOP! Check your work. 

Log in, then try logging out.




UH OH! Time to debug!

Let's make note of all the clues we're given. We're getting Oops! No user with that email address has been registered. back in the browser.


Where is this coming from?

Click For Answer



Why is this happening?

Click For Answer



How can we fix this?
Click For Answer

STOP! Check your work.




# Create a Dashboard View

Our Dashboard is going to be the protected index page. So let's create this view at the root of our views directory, along side our index.ejs

touch views/dashboard.ejs
In views/dashboard.ejs:

 <!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>MEEN Auth Starter</title>
</head>

<body>
	<%- include('./partials/nav.ejs')  %>
	<h1>Dashboard</h1>
</body>

</html>



# Render the Dashboard View

We've decided we want to render the index view IF the user is logged out and we want to render the dashboard view IF the user is logged in.

In server.js:

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



STOP! Check your work.


Navigate to http://localhost:3000/
Use the navbar to navigate to your login page
Login - you should be redirected to the dashboard page
Logout - you should be redirected to the index page



# Create a Template Repo!
Push your work up to github
Navigate to your repo on github.com then navigate to the repo settings
Click the box to turn it into a template repo


