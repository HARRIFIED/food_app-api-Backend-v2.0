const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require("cors");
const auth = require('./routes/auth');
const user = require('./routes/user');
const product = require('./routes/product');

dotenv.config();
const app = express();

app.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

app.use(express.json());
// app.use(express.urlencoded({ extended: false }))

//routes
app.use("/api/auth", auth);
app.use("/api/users", user);
app.use("/api/products", product)

mongoose
    .connect(process.env.MONGO_KEY)
    .then(() => console.log("DB connected successfully"))
    .catch((err) => console.log(err))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server listening on ${PORT}`));
