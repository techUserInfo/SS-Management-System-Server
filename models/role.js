
// import express from 'express';
// import mongoose from 'mongoose';
// const app = express();

// mongoose.connect('mongodb+srv://Alpha_1@ssms-server.irr0ltm.mongodb.net/?retryWrites=true&w=majority&appName=SSMS-server', {})


const mongoose = require("mongoose");


// app.listen(port, () => {
//   console.log('this is going on http://localhostt:${port}');
// });

// Role schema
const roleSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: String, required: true },
});

module.exports = mongoose.model("Role", roleSchema);

