require('dotenv').config();
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(methodOverride('_method')); //For using making any types of HTTP request from HTML Forms
app.use(express.json()); //For parsing any requests of application/json type
app.use(express.static(path.join(__dirname, 'static'))); //For serving static files


app.listen(8080, () => {
    console.log('Server running on http://localhost:8080/');
})
