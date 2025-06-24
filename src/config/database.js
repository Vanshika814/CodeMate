// require('dotenv').config();
// const mongoose = require("mongoose");

// const connectDB = async () => {
//     await mongoose.connect(
//         process.env.DB_CONNECTION_STRING
//     );
// }

// module.exports = connectDB;

require('dotenv').config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
