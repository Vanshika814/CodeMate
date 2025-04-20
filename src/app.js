const express = require("express");

const app = express();

//handle the request

app.use("/user", (req, res) =>{
    res.send("HAHAHAHAHAHHA");
});

// 'get' will only handle the GET call for user
app.get("/user", (req, res) =>{
    res.send({firstname: "Vanshika", lastname: "agarwal"});
});

app.post("/user", (req, res) =>{
    //saving data to DB
    res.send("Data successfully send ot database!");
});

app.delete("/user", (req, res) =>{
    res.send("Deleted successfully");
})

// 'use' will match all the http method API call to /test
app.use("/test", (req, res) =>{
    res.send("Hello from the server..");
});


// server listening
app.listen(3000, () =>{
    console.log("Server is successfully listening to port 3000!");
});