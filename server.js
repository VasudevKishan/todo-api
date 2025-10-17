require('dotenv').config();
const express = require('express');
const app = express();
const { logger } = require('./middleware/logger');

const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

app.use(logger);

app.use(express.json());
