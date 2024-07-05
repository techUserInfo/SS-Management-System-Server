const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/usermain');

//user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});
//role schema
const roleSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    role: { type: String, required: true},
    email: { type: String, required: true },
    phone_number: { type: String, required: true }
  });
// models
const User = mongoose.model('User', userSchema);
const Role = mongoose.model('Role', roleSchema);
// route
app.post('/assignrole', async (req, res) => {
    const { username, role } = req.body;
  
    // if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    //if the role is valid
    if (!['admin', 'teacher', 'student'].includes(role)){
      return res.status(400).json({ message: 'Invalid role' });
    }
  
    //if the role is already assigned
    const existingRole = await Role.findOne({ username });
    if (existingRole) {
      return res.status(400).json({ message: 'Role already assigned' });
    }
  
    // Assign role 
    const newRole = new Role({
      username,
      role,
      email: user.email,
      phone_number: user.phone_number
    });
    await newRole.save();
    res.status(200).json({ message: 'Role assigned successfully' });
  });
  
  //update role

  app.patch('/updaterole', async (req, res) => {
    const { username, role } = req.body;
  
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    // Check if the role is valid
    if (!['admin', 'teacher', 'student'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
  
    // Check if the user has an existing role
    const existingRole = await Role.findOne({ username });
    if (!existingRole) {
      return res.status(404).json({ message: 'Role not assigned yet' });
    }
  
    // Update role
    existingRole.role = role;
    await existingRole.save();
    res.status(200).json({ message: 'Role updated successfully' });
  });

app.listen(3555, () => {
  console.log(`Server is running`);
});
