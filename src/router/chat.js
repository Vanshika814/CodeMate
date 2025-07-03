const express = require("express");
const { requireClerkAuth } = require("../middleware/auth");
const {Chat} = require("../models/chat")
const chatRouter = express.Router();

chatRouter.get("/chat/:targetId", requireClerkAuth, async (req, res) => {
    const {targetId} = req.params;
    const userId = req.user._id;
    try{
        let chat = await Chat.findOne({
            participants: {$all: [userId, targetId]}
        }).populate({
            path: "messages.senderId",
            select: "FirstName LastName",
        });

        if(!chat){
            chat = new Chat({
                participants: [userId, targetId],
                messages: [],
            })
            await chat.save();
        }
        res.json(chat);
    } catch(err){
        console.log(err);
    }
})



module.exports = chatRouter;