const express = require("express");
const {requireClerkAuth}  = require("../middleware/auth");
const userRouter = express.Router();
const connectionRequest = require("../models/connectionrequest"); 
const USER_SAFE_DATA = "FirstName LastName photoUrl age gender about skills projects bioAnswers availability";
const User = require("../models/user");

//GET ALL THE PENDING CONECTION REQUEST FOR THE LOGGEDIN USER
userRouter.get("/user/request/received", requireClerkAuth, async (req, res) =>{
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

userRouter.get("/user/connections", requireClerkAuth, async (req, res) =>{
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

userRouter.get("/feed", requireClerkAuth, async (req, res) =>{
    try{
        const loggedInuser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50 ? 50 : limit;
        const skip = (page-1)*limit;

        const connectionRequests = await connectionRequest.find({
            $or: [
                {fromUserId: loggedInuser._id},
                {toUserId: loggedInuser._id},
            ],
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        const users = await User.find({
           $and:[{ _id: {$nin: Array.from(hideUsersFromFeed)}},
            {_id: {$ne: loggedInuser._id}}],
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        res.send(users);

    } catch(err){
        res.status(400).send("ERROR:" + err.message);
    };
});
module.exports = userRouter;