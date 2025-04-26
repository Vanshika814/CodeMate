const express = require("express");
const connectDB = require("./config/database");
const app = express();
const user = require("./models/user");

app.use(express.json()); // express.json middleware


app.post("/signup", async (req, res) =>{
    
    //creating a new instance of the user model

    const User = new user(req.body);

    try {
        await User.save();
        res.send("User added Successfully!");
    } catch (err) {
        res.status(400).send("Error saving the user: " + err.message);
    }
});



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
