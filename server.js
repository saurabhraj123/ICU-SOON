// Importing Modules
const express = require('express');
const app = express();
const cookieParser  = require('cookie-parser');

// View Engine
app.set('view engine', 'pug');

// Middlewares
app.use(express.urlencoded({entended: false}))
app.use(cookieParser());

// Importing Routes
const homeRouter           = require('./routes/home');
const authenticationRouter = require('./routes/authentication');

// Setting Routes
app.use(express.static('public'));
app.use('/', homeRouter);
app.use('/authenticate', authenticationRouter);

// Setting PORT
const port = process.env.PORT || 3000;
app.listen(port, console.log(`Connected to Server at port ${port}...`));