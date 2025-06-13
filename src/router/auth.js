const express = require("express");
const authrouter = express.Router();
const {ValidateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authrouter.post("/signup", async (req, res) =>{
    // validate the data
    try {
        ValidateSignUpData(req);

        const {FirstName, LastName, emailId, password} = req.body;

    // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10)
        console.log(passwordHash);
    //creating a new instance of the user model

        const user = new User({
            FirstName,
            LastName,
            emailId,
            password: passwordHash,
        });
        await user.save();
        res.send("User added Successfully!");
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

authrouter.post("/login", async (req, res) =>{
    try {
        const {emailId, password} =  req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid Credentials");
        } 
        const isPasswordVaild = await user.validatePassword(password);

        if(isPasswordVaild) {
            const token = await user.getJWT();
            
            res.cookie("token", token, {expires: new Date(Date.now( ) + 8 *3600000),
            });
            res.send("Login Successfull!");
        } else {
            throw new Error("Invalid Credentials");
        }

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})


module.exports = authrouter;