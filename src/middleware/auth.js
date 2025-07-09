// const jwt = require("jsonwebtoken");
// const User = require("../models/user");

// const UserAuth = async(req,res,next) =>{
//     try{
//         const {token} = req.cookies;
//         if (!token){
//             return res.status(401).send("Please login!!");
//         }
//         const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
//         const {_id} = decodedObj;
//         const user = await User.findById(_id);
//         if(!user){
//             throw new Error("User not Found");
//         }

//         req.user = user;
//         next();
//     }

    
//     catch(err){
//         res.status(400).send("ERROR : " + err.message);
//     }
// };

// module.exports ={
//     UserAuth,
// }

const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const User = require("../models/user");

// Create the base Clerk middleware
const clerkMiddleware = ClerkExpressRequireAuth();

// Enhanced middleware that adds MongoDB user data
const requireClerkAuth = (req, res, next) => {
  console.log("🔐 Auth middleware called for:", req.path);
  console.log("🔐 Headers:", {
    authorization: req.headers.authorization ? "Present" : "Missing",
    contentType: req.headers['content-type']
  });
  
  // First apply Clerk authentication
  clerkMiddleware(req, res, async (err) => {
    if (err) {
      console.error("❌ Clerk authentication failed:", err);
      return res.status(401).json({ 
        error: "Authentication failed",
        message: "Please sign in to continue" 
      });
    }

    try {
      // Get Clerk user ID from the authenticated request
      const clerkUserId = req.auth?.userId;
      
      console.log("🔐 Clerk user ID:", clerkUserId);
      
      if (!clerkUserId) {
        console.error("❌ No user ID found in request");
        return res.status(401).json({ 
          error: "No user ID found",
          message: "Authentication token is invalid" 
        });
      }

      // Find the user in MongoDB using clerkId
      const user = await User.findOne({ clerkId: clerkUserId });
      
      console.log("🔐 MongoDB user found:", !!user);
      
      if (!user) {
        console.log("❌ User not found in MongoDB for clerkId:", clerkUserId);
        return res.status(404).json({ 
          error: "User not found in database",
          message: "Please complete your profile setup",
          clerkId: clerkUserId,
          action: "sync_required"
        });
      }

      // Attach user to request object for use in route handlers
      req.user = user;
      req.clerkUserId = clerkUserId;
      
      console.log("✅ Auth middleware successful for user:", user.FirstName);
      next();
    } catch (dbError) {
      console.error("❌ Database error in auth middleware:", dbError);
      return res.status(500).json({ 
        error: "Database error during authentication",
        message: "Please try again later" 
      });
    }
  });
};

module.exports = { requireClerkAuth };
