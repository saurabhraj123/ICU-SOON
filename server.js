// Importing Modules
const express       = require('express');
const cookieParser  = require('cookie-parser');
const app           = express();

// View Engine
app.set('view engine', 'pug');

// Middlewares
app.use(express.urlencoded({entended: false}))
app.use(cookieParser());
require('./startup/prod')(app);

// Importing Routes
const homeRouter           = require('./routes/home');
const authenticationRouter = require('./routes/authentication');
const formRouter           = require('./routes/form');
const appointmentRouter    = require('./routes/appointment');
const supportRouter        = require('./routes/quick_support');
const servicesRouter       = require('./routes/services');
const contactUsRouter      = require('./routes/contactUs');

// Setting Routes
app.use(express.static('public'));
app.use('/', homeRouter);
app.use('/authenticate', authenticationRouter);
app.use('/user', formRouter);
app.use('/appointment', appointmentRouter);
app.use('/quicksupport', supportRouter);
app.use('/services', servicesRouter);
app.use('/contact', contactUsRouter);

// Setting PORT
const port = process.env.PORT || 3000;
app.listen(port, console.log(`Connected to Server at port ${port}...`));