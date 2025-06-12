const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {ValidateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {UserAuth} = require("./middleware/auth");
const cors = require("cors");

app.use(cors());
app.use(express.json()); // express.json middleware
app.use(cookieParser());

app.post("/signup", async (req, res) =>{
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

app.post("/login", async (req, res) =>{
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


app.get("/profile",UserAuth, async (req, res) =>{
    try{
        const user = req.user;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

app.post("/sendConnectionRequest", UserAuth, async (req,res)=>{
    const user = req.user;
    //sending a connection request
    console.log("Sending a connection Request!");

    res.send(user.FirstName +" sent a connection request!");
})

connectDB()
    .then(() =>{
        console.log("Database connection established...");
        // listening to server
        app.listen(3000, () =>{
            console.log("Server is successfully listening to port 3000!");
        });
    })
    .catch((err) =>{
        console.log("Database cannnot be connected!!");
    });
