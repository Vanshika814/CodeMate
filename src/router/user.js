const express = require("express");
const {UserAuth}  = require("../middleware/auth");
const userRouter = express.Router();
const connectionRequest = require("../models/connectionrequest"); 
const USER_SAFE_DATA = "FirstName LastName photoUrl age gender about skills";


//GeT ALL THE PENDING CONECTION REQUEST FOR THE LOGGEDIN USER
userRouter.get("/user/request/received", UserAuth, async (req, res) =>{
    try{
        const loggedInuser = req.user;

        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInuser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);



        res.json({message: "data fetched successfully!",
            data: connectionRequests,
        });
    } catch(err){
        res.status(400).send("ERROR" + err.message); 
    };
});

userRouter.get("/user/connections", UserAuth, async (req, res) =>{
    try{
         const loggedInuser = req.user;

        const connectionRequests = await connectionRequest.find({
            $or: [
                {toUserId: loggedInuser._id, status: "accepted"},
                {fromUserId: loggedInuser._id, status: "accepted"},
            ],
        }).populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) =>{
            if(row.fromUserId._id.toString() === loggedInuser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({data});
    } catch(err){
        res.status(400).send("ERROR:" + err.message);
    };
});

module.exports = userRouter;