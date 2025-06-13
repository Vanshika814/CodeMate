const express = require("express");
const requestRouter = express.Router();
const {UserAuth} = require("../middleware/auth");

requestRouter.post("/sendConnectionRequest", UserAuth, async (req,res)=>{
    const user = req.user;
    //sending a connection request
    console.log("Sending a connection Request!");

    res.send(user.FirstName +" sent a connection request!");
})

module.exports = requestRouter;