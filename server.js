const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/routes');
const dotenv = require('dotenv');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended : true }));

dotenv.config()
const url = process.env.url;

mongoose.connect(url)
.then(() => app.listen(80, () => console.log('listening to port 80')))
.catch(err => console.log(err));

app.use(router);