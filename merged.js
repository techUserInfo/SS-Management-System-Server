const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 6666;
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/mainDatabase");

const userSchema = new mongoose.Schema(
  {
    UserName: { type: String, required: true, unique: true },
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    PhoneNumber: { type: String, required: true },
    Address: { type: String, required: true },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// Login API [By Pritom]
app.get("/login", async (req, res) => {
  const { UserName, Password } = req.body;
  try {
    const user = await User.findOne({ UserName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.Password !== Password) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    user.lastLogin = new Date();
    await user.save();
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Signup API [By Pritom]
app.post("/signup", async (req, res) => {
  const newUser = new User(req.body);
  try {
    const find = await User.findOne({ UserName: req.body.UserName });
    if (find) {
      return res.status(400).json({ message: "User already registered" });
    }
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Check email and phone number [By Chaitali] [fixes all Errors]
app.get("/check-email", async (req, res) => {
  try {
    const user = await User.findOne({ Email: req.body.Email });
    res.status(200).json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/check-phone", async (req, res) => {
  try {
    const user = await User.findOne({ PhoneNumber: req.body.PhoneNumber });
    res.status(200).json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check username [By Sayani] [fixes all Errors]
app.get("/check-username", async (req, res) => {
  try {
    const user = await User.findOne({ UserName: req.body.UserName });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Student signup [By Shreya]
const studentSchema = new mongoose.Schema({
  UserName: { type: String, required: true },
  LastName: { type: String },
  ParentName: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
  Email: { type: String },
  Class: { type: String, required: true },
  Section: { type: String, required: true },
  SPOC: { type: String, default: null },
});

const Student = mongoose.model("Student", studentSchema);

app.post("/signup-student", async (req, res) => {
  const newStudent = new Student(req.body);
  try {
    const find = await Student.findOne({ UserName: req.body.UserName });
    if (find) {
      return res.status(400).json({ message: "Student already registered" });
    }
    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* Role Define, Update, Delete, Admin & Superadmin collection, Restriction Admins from deleting Other Admins
Only Admins and superAdmin can Delete Other Users, Admins Can't Delete Superadmin, Superadmin Delete Any User Including Admins
Remove Data From Collection When Role Changed   [ By Pritom ]  */

// Role schema 
const roleSchema = new mongoose.Schema({
  UserName: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  Email: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
});

const adminSchema = new mongoose.Schema({
  UserName: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  Email: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
});

const superAdminSchema = new mongoose.Schema({
  UserName: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  Email: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
});

const Role = mongoose.model("Role", roleSchema);
const Admin = mongoose.model("Admin", adminSchema);
const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

// Assign role route
app.post("/assignrole", async (req, res) => {
  const { UserName, role } = req.body;

  try {
    const user = await User.findOne({ UserName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!["admin", "teacher", "student", "superadmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingRole = await Role.findOne({ UserName });
    if (existingRole) {
      return res.status(400).json({ message: "Role already assigned" });
    }

    const newRole = new Role({
      UserName,
      role,
      Email: user.Email,
      PhoneNumber: user.PhoneNumber,
    });
    await newRole.save();

    if (role === "admin") {
      const newAdmin = new Admin({
        UserName,
        role,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
      });
      await newAdmin.save();
    }

    if (role === "superadmin") {
      const newSuperAdmin = new SuperAdmin({
        UserName,
        role,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
      });
      await newSuperAdmin.save();
    }

    res.status(200).json({ message: "Role assigned successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update role route
app.patch("/updaterole", async (req, res) => {
  const { UserName, role } = req.body;

  try {
    const user = await User.findOne({ UserName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!["admin", "teacher", "student", "superadmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingRole = await Role.findOne({ UserName });
    if (!existingRole) {
      return res.status(404).json({ message: "Role not assigned yet" });
    }

    if (existingRole.role === "admin" && role !== "admin") {
      await Admin.findOneAndDelete({ UserName });
    } else if (role === "admin" && existingRole.role !== "admin") {
      const newAdmin = new Admin({
        UserName,
        role,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
      });
      await newAdmin.save();
    }

    if (existingRole.role === "superadmin" && role !== "superadmin") {
      await SuperAdmin.findOneAndDelete({ UserName });
    } else if (role === "superadmin" && existingRole.role !== "superadmin") {
      const newSuperAdmin = new SuperAdmin({
        UserName,
        role,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
      });
      await newSuperAdmin.save();
    }

    existingRole.role = role;
    await existingRole.save();

    res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Middleware to check if UserName is admin
const isAdmin = async (req, res, next) => {
  const { UserName } = req.body;
  try {
    const userRole = await Role.findOne({ UserName });
    if (userRole && userRole.role === "admin") {
      next();
    } else {
      res
        .status(403)
        .json({ message: "Forbidden: Only admins can perform this action" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to check if UserName is superadmin
const isSuperAdmin = async (req, res, next) => {
  const { UserName } = req.body;
  try {
    const userRole = await Role.findOne({ UserName });
    if (userRole && userRole.role === "superadmin") {
      next();
    } else {
      res
        .status(403)
        .json({
          message: "Forbidden: Only superadmins can perform this action",
        });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete user route for Admins
app.delete("/admin/user", isAdmin, async (req, res) => {
  const { UserNameToDelete } = req.body;

  try {
    const adminToDelete = await Admin.findOne({ UserName: UserNameToDelete });
    if (adminToDelete) {
      return res
        .status(403)
        .json({ message: "Forbidden: Admins cannot delete other admins" });
    }

    const superAdminToDelete = await SuperAdmin.findOne({
      UserName: UserNameToDelete,
    });
    if (superAdminToDelete) {
      return res
        .status(403)
        .json({ message: "Forbidden: Admins cannot delete a superadmin" });
    }

    await User.findOneAndDelete({ UserName: UserNameToDelete });
    await Role.findOneAndDelete({ UserName: UserNameToDelete });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete user route for superAdmins
app.delete("/superadmin/user", isSuperAdmin, async (req, res) => {
  const { UserNameToDelete } = req.body;

  try {
    await User.findOneAndDelete({ UserName: UserNameToDelete });
    await Role.findOneAndDelete({ UserName: UserNameToDelete });
    await Admin.findOneAndDelete({ UserName: UserNameToDelete });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// Signup API [by Ishita] [Already Done By Me Earlier] 

// const express = require("express");
// const mongoose = require("mongoose");
// const port = 3000;
// const app = express();
// app.use(express.json());


// console.log ('mongo db starts from here');

// mongoose.connect("mongodb://localhost:27017/registration");
// k
// const userSchema = new mongoose.Schema({
//     username:{
//         type:String,
//         required:true,
//     },
//     email:{
//         type:String,
//     },
//     password:{
//         type:String,
//         require:true,
//     }
// });
// const User= mongoose.model("inputs",userSchema);

// app.post('/signup', async (req, res) => {

//     const newData = User(req.body);

//     try{
//         const find = await User.findOne({username : req.body.username})
//         if(find){
//             return res.status(300).send("already registered")
//         }
//         newData.save();
//        res.status(201).send("registered");
//     }catch (error) {
//         res.status(400).send(error);
//     }
// });

// app.listen(port, () => {
//     console.log('this is going on http://localhostt:${port}');
// });


// Login API [By Suvechha] [Already DoneBy Me Earlier]
// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');

// // Middleware
// app.use(express.json()); // Place this before defining routes

// // Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/SSMS");
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// // Define Schema and Model
// const userSchema = new mongoose.Schema({
//   userId: String,
//   password: String
// });
// const User = mongoose.model("User", userSchema);

// // Route to check if user exists
// app.get('/checkuser', async (req, res) => {
//   const { userId } = req.body;
//   try {
//    const user = await User.findOne({userId });
//       if (user!==null) {
//       res.status(200).json({ message: true });
//     } else {
//       console.log(res.json);
//       res.status(200).json({ message: false });
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: error.message });
//   }
// });

// // Start the server
// const PORT = 7778;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });




/* Login With Password decode API [by Alapan] [Not Completed] */

// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
// const port = 7000;
// app.use(bodyParser.urlencoded({ extended: true }));                           
// const mongoose = require("mongoose");
// app.use(bodyParser.json());
// mongoose.connect("mongodb://localhost:27017/SSMS");
// const userSchema = new mongoose.Schema({
//     password:String,
//     userId:String
// });

// const User = mongoose.model("users", userSchema);

// app.post('/check-password', async (req, res) => {
//     const { passwordValue } = req.body;
//     try {
//         const user = await USER.find({  });
//         if (user) {
//             let answer=false
//             user.forEach(ele=>{
//                 if(ele.password===passwordValue){
//                     answer=true
//                 }
//             })
//             if(answer){
//                 return res.status(200).json({ exists: true });
//             }else {
//                 return res.status(200).json({ exists: false });
//             }
//         }
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// app.post('/check-userId', async (req, res) => {
//     const { userIdValue } = req.body;
//     try {
//         const user = await User.find({  });
//         if (user) {
//             let answer=false
//             user.forEach(ele=>{
//                 if(ele.userId===userIdValue){
//                     answer=true
//                 }
//             })
//             if(answer){
//             return res.status(200).json({ exists: true });
//         } else {
//             return res.status(200).json({ exists: false });
//         }
//     }
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
// app.post('/decode', (req, res) => {
//     const userId = req.headers['userId'];
//     const userPassword = req.headers['userPassword'];
//     if(userId && userPassword){
  
//     }
  
//     const decodedText = Buffer.from(encodedText, 'base64').toString('utf-8');
//   });

// app.listen(port, () => {
//     console.log('Server is running on http://localhost:${port}');

// });





/* check UserName Is Registered Or not [By Priyanka] [Not Completed] */

// const app = require('express');
// const mongoose = require('mongoose');
// const app = express();
// const url = mongoose.connect("mongodb://localhost:27017/infowebment",{
// useNewUrlParser: true,
//   useUnifiedTopology: true,
  // })
// connect.then(() => {
//   console.log('Connected to MongoDB');
// })
// .catch((error) => {
//   console.error('Error connecting to MongoDB:', error);
// });
// app.get('/',async(req,resp)=>{
//     const data={
//         role:req.body.username,
//         email_id:req.body.password,
//         phone_number:req.body.phone_number
//     }
// });   
    
// const port =6666;
// app.listen(port,()=>{
//     console.log('Server is running on port ${port}');
// });
// const userSchema = new mongoose.Schema({
//     role: {
//         type:String,
//         required:true,
//     },
//     mobile_number: {
//         type:String,
//         required:true,
//         Validate: {
//             validator: function(v) {
//                 return /\d{10}/.test(v);
//             },
//             message: props => '${props.value}is not a valid mobile number!'
//         }
//             },
//             email_id: {
//                 type: String,
//                 required:true,
//                 unique:true
//             },
//             role: {
//                 type:String,
//                 enum: ['user','admin','modaretor','student'],
//                 default:'user'
//             }
//         });
//         const user = mongoose.model('user',userSchema);
//         module.exports= user;