const socket = require("socket.io");
const crypto = require("crypto");
const {Chat} = require("../models/chat");

const getSecretRoomId  = (userId, targetId) => {
     return crypto
     .createHash("sha256")
     .update([userId, targetId].sort().join("_"))
     .digest("hex");
}

const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours}h ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days}d ago`;
    }
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                "https://devtinder-web-5xd8.onrender.com"
            ],
            credentials: true
        },
    });
    io.on("connection" , (socket) => {
        //handle websocket events
        socket.on("joinChat", ({FirstName, userId, targetId}) => {
            const roomId = getSecretRoomId(userId, targetId);
            console.log(FirstName + " Joined Room : " + roomId);
            socket.join(roomId);
        });

        socket.on("sendMessage", async ({FirstName, userId, targetId, text}) => {

            //save msg to the database
            try{
                const roomId = getSecretRoomId(userId, targetId);
                console.log(FirstName + " " + text);

                //check if userId and targetId are already friends
                
                
                let chat = await Chat.findOne({
                    participants: {$all: [userId, targetId]},
                });
                
                if(!chat){
                    chat = new Chat({
                        participants: [userId, targetId],
                        messages: [],
                    })
                }

                const messageTimestamp = new Date();
                chat.messages.push({
                    senderId: userId, 
                    text,
                });
                io.to(roomId).emit("messageReceived", {FirstName, text, senderId: userId, timestamp: messageTimestamp.toISOString()});
                await chat.save();

            } catch(err){
                console.log(err);
            }

        });

        

        socket.on("disconnect", () => {});      
    });

};


module.exports = initializeSocket;


