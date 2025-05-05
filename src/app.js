const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {ValidateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json()); // express.json middleware


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
        const isPasswordVaild = await bcrypt.compare(password, user.password);

        if(isPasswordVaild) {
            res.send("Login Successfull!");
        } else {
            throw new Error("Invalid Credentials");
        }

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})


// Get user by email
app.get("/user", async (req, res) =>{
    const userEmail = req.body.emailId; // reading it

    try{
        const users = await User.findOne({emailId: userEmail});
        res.send(users);

        // const users = await User.find({emailId: userEmail}); // finding it 
        // if (users.length === 0){
        //     res.status(400).send("User not found!");
        // } else{
        //     res.send(users); // sending the data back
        // }
    }
    catch(err) {
        res.status(400).send("Something went wrong!!");
    }
})

//Feed API GET /feed - get all the userts from the database 
app.get("/feed", async (req, res) =>{
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err) {
        res.status(400).send("Something went wrong!!");
    };
    
});


// delete API
app.delete("/user", async (req, res) =>{
    const userId = req.body.userId;
    try{
        const users = await User.findByIdAndDelete({_id: userId});
        res.send("User deleted successfully!!");
    }
    catch(err) {
        res.status(400).send("Something went wrong!!");
    }
});

// update the user 
app.patch("/user/:userId", async (req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;
   // console.log(data);
    try{
        const ALLOWED_UPDATES = ["photourl","about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        const users = await User.findByIdAndUpdate({_id: userId}, data,{
            returnDocument:"after",
            runValidators: true,
        });
        console.log(users);
        res.send("User updated successfully!");
    } catch(err){
        res.status(400).send("UPDATE FAILED" + err.message);
    }
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
