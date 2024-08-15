require('dotenv').config();
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
const apiRoute = require('./routes/apiRoute');
const {handleIncorrectRoutes, handleAppErrors} = require('./controllers/appController');

PORT = process.env.PORT || 8080; // Defines port from environment variable. If not present, 8080 is set.

app.set('views', path.join(__dirname, 'views'));


app.use(methodOverride('_method')); //For using making any types of HTTP request from HTML Forms
app.use(express.json()); //For parsing any requests of application/json type
app.use(express.static(path.join(__dirname, 'static'))); //For serving static files


app.use('/api', apiRoute); // Uses defined routes in apiRoute.js


app.all('*', handleIncorrectRoutes); // Handles undefined routes
app.use(handleAppErrors); // Handles all errors.

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
})
