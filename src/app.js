const express = require("express");

const app = express();

//handle the request
app.use("/", (req, res) =>{
    res.send("Namaste Vanshika");
});

app.use("/test", (req, res) =>{
    res.send("Hello from the server..");
});

app.use("/hello", (req, res) =>{
    res.send("Hello hello hello");
});

// server listening
app.listen(3000, () =>{
    console.log("Server is successfully listening to port 3000!");
});