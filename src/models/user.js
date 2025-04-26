const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    FirstName: {
        type: String,
    },
    LastName: {
        type: String,
    },
    emailId: {
        type: String,
    },
    password: {
        type: String,
    },
    age: {
        type: Number,
    }, 
    gender: {
        type: String,
    },
});

module.exports = mongoose.model("User", UserSchema);