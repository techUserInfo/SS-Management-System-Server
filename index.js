const express = require('express');

const app = express();
const port = 7001;

app.use(express.json());
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/SSMS");
const userSchema = new mongoose.Schema({
    email:String,
    PhoneNumber:String
})
const User = mongoose.model("user", userSchema);


app.get('/check-email', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/check-phone', async (req, res) => {
    const { PhoneNumber } = req.body;
    try {
        const user = await User.findOne ({ PhoneNumber: req.body.PhoneNumber });
        if (user) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log('Server is running on http://localhost:${port}');

});