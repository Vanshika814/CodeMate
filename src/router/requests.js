const express = require("express");
const requestRouter = express.Router();
const {UserAuth} = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionrequest");


requestRouter.post("/request/send/:status/:toUserId", UserAuth, async (req,res)=>{

    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignored"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status"});
        }

        // If there is an existing connection request
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ],
        });
        if(existingConnectionRequest) {
            return res.status(400).json({message: "Connection request Already exists!!"})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId, 
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message: "Connection request sent Successfully",
            data,
        });

    } catch(err) {
        res.status(400).send("ERROR:" + err.message);
    }
});

module.exports = requestRouter;