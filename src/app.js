require('dotenv').config();
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors({
    origin: "https://devtinder-web-5xd8.onrender.com",
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());

const authrouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/requests");
const userRouter = require("./router/user");

app.use("/", authrouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


connectDB()
    .then(() =>{
        console.log("Database connection established...");
        // listening to server
        app.listen(process.env.PORT, () =>{
            console.log(`Server is successfully listening to port ${process.env.PORT}!`);
        });
    })
    .catch((err) =>{
        console.log("Database cannnot be connected!!");
    });
