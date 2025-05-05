const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        minlength: 4,
        required: true,
    },
    LastName: {
        type: String,
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address:" + value);
            }
        },
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
    }, 
    gender: {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not Valid");
                
            }
        },
    },
    photourl:{
        type: String,
    },
    about:{
        type: String,
        default: "This is the default about me section!"
    },
    skills:{
        type: [String]
    }
},
{
    timestamps: true,
});

module.exports = mongoose.model("User", UserSchema);