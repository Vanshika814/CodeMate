const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json()); // express.json middleware


app.post("/signup", async (req, res) =>{
    
    //creating a new instance of the user model

    const user = new User(req.body);

    try {
        await user.save();
        res.send("User added Successfully!");
    } catch (err) {
        res.status(400).send("Error saving the user: " + err.message);
    }
});

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
app.patch("/user", async (req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
   // console.log(data);
    try{
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
