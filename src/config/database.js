const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://vanshikaagarwal781:oGGNSrQOmNcBVbMj@namastenode.viedw34.mongodb.net/DevTinder"
    );
}

module.exports = connectDB;