const express = require("express");

const app = express();

const {adminAuth, UserAuth} = require("./middleware/auth");

// handle auth middleware for all GET, POST......
app.use("/admin", adminAuth);

app.post("/user/login", (req, res) =>{
    res.send("user login successfull");
});

app.get("/user", UserAuth, (req, res) =>{
    res.send("User data sent");
});

app.get("/admin/getAlldata", (req, res) =>{
    res.send("All data sent!");
});

app.get("/admin/deleteUser", (req, res) =>{
    res.send("Deleted the user.");
});



// server listening
app.listen(3000, () =>{
    console.log("Server is successfully listening to port 3000!");
});