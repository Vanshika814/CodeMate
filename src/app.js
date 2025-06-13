const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors());
app.use(express.json()); // express.json middleware
app.use(cookieParser());

const authrouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/requests");

app.use("/", authrouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
