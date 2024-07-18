const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const LoginRoute = require("./routes/loginroutes");

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
dotenv.config();
app.use(bodyParser.json());
app.use(LoginRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() =>
    console.log(
      "connection successful...Mongodb Database connected successfully"
    )
  )
  .catch((err) => console.log(err));

module.exports = app;
