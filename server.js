const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser : true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB Connected');}
)

app.use('/', require('./routes/vurl'))

app.listen(port, ()=> {
    console.log(`Server is running on port: ${port}`);
} )