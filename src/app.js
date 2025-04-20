const express = require("express");

const app = express();

//handle the request

// 'get' will only handle the GET call for user
// multiple route handlers
//app.use("/user", rH, rH2, rH3, rH4, rH5);

app.get("/user", 
    (req, res, next) =>{
        console.log("Handling the route User 1 !!");
        //res.send("Response !!");
        next();
    },
    (req, res, next) =>{
        console.log("Handling the route User 2 !!");
        //res.send("Response 2 !!");
        next();
    },
    (req, res, next) =>{
        console.log("Handling the route User 3 !!");
        //res.send("Response 3 !!");
        next();
    },
    (req, res, next) =>{
        console.log("Handling the route User 4 !!");
        //res.send("Response 4 !!");
        next();
    },
    (req, res, next) =>{
        console.log("Handling the route User 5 !!");
        res.send("Response 5 !!");
        //next();
    },
);




// server listening
app.listen(3000, () =>{
    console.log("Server is successfully listening to port 3000!");
});