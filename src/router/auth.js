// const express = require("express");
// const authrouter = express.Router();
// const {ValidateSignUpData} = require("../utils/validation");
// const User = require("../models/user");
// const bcrypt = require("bcrypt");

// authrouter.post("/signup", async (req, res) =>{
//     // validate the data
//     try {
//         ValidateSignUpData(req);

//         const {FirstName, LastName, emailId, password} = req.body;

//     // Encrypt the password
//         const passwordHash = await bcrypt.hash(password, 10)
//         console.log(passwordHash);
//     //creating a new instance of the user model

//         const user = new User({
//             FirstName,
//             LastName,
//             emailId,
//             password: passwordHash,
//         });
//         const SavedUser = await user.save();
//         const token = await SavedUser.getJWT();
            
//             res.cookie("token", token, {
//                 expires: new Date(Date.now( ) + 8 *3600000),
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production',
//                 sameSite: 'none'
//             });

//         res.json({message: "User added Successfully!", data: SavedUser});
//     } catch (err) {
//         res.status(400).send("ERROR : " + err.message);
//     }
// });

// authrouter.post("/login", async (req, res) =>{
//     try {
//         const {emailId, password} =  req.body;
//         const user = await User.findOne({emailId: emailId});
//         if(!user) {
//             throw new Error("Invalid Credentials");
//         } 
//         const isPasswordVaild = await user.validatePassword(password);

//         if(isPasswordVaild) {
//             const token = await user.getJWT();
            
//             res.cookie("token", token, {
//                 expires: new Date(Date.now( ) + 8 *3600000),
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production',
//                 sameSite: 'none'
//             });
//             res.send(user);
//         } else {
//             throw new Error("Invalid Credentials");
//         }

//     } catch (err) {
//         res.status(400).send("ERROR : " + err.message);
//     }
// })

// authrouter.post("/logout", async (req, res) =>{
//     res.cookie("token", null, {
//         expires: new Date(Date.now()),
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'none'
//     })
//     .send("logout Successfull!");
// })

// module.exports = authrouter;

const express = require("express");
const authrouter = express.Router();
const User = require("../models/user");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const { requireClerkAuth } = require("../middleware/auth");

// Base Clerk middleware for routes that need authentication
const clerkAuth = ClerkExpressRequireAuth();

// Webhook endpoint to sync users automatically when they sign up via Clerk
authrouter.post("/webhook/user", express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const { type, data } = req.body;
    
    console.log("📥 Received Clerk webhook:", type);
    
    // Handle user creation
    if (type === "user.created") {
      const clerkUser = data;
      
      // Check if user already exists
      const existingUser = await User.findOne({ clerkId: clerkUser.id });
      
      if (!existingUser) {
        const newUser = new User({
          clerkId: clerkUser.id,
          FirstName: clerkUser.first_name || "User",
          LastName: clerkUser.last_name || "",
          emailId: clerkUser.email_addresses[0]?.email_address || "",
        });
        
        await newUser.save();
        console.log("✅ New user synced from Clerk:", newUser.emailId);
      }
    }
    
    // Handle user updates
    if (type === "user.updated") {
      const clerkUser = data;
      
      await User.findOneAndUpdate(
        { clerkId: clerkUser.id },
        {
          FirstName: clerkUser.first_name || "User",
          LastName: clerkUser.last_name || "",
          emailId: clerkUser.email_addresses[0]?.email_address || "",
        },
        { upsert: true } // Create if doesn't exist
      );
      console.log("✅ User updated from Clerk:", clerkUser.id);
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

// Auto-sync endpoint - tries to create or update user from Clerk data if not exists
authrouter.post("/auto-sync", clerkAuth, async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    
    // Get user data from Clerk and upsert in MongoDB
    const { clerkClient } = require("@clerk/clerk-sdk-node");
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    
    // Upsert user by clerkId or emailId
    const user = await User.findOneAndUpdate(
      {
        $or: [
          { clerkId: clerkUserId },
          { emailId: clerkUser.emailAddresses[0]?.emailAddress }
        ]
      },
      {
        $set: {
          clerkId: clerkUserId,
          FirstName: clerkUser.firstName || "User",
          LastName: clerkUser.lastName || "",
          emailId: clerkUser.emailAddresses[0]?.emailAddress || "",
        }
      },
      { upsert: true, new: true }
    );
    
    res.status(201).json({ 
      message: "User auto-synced successfully", 
      user: user 
    });
  } catch (error) {
    console.error("❌ Auto-sync error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Manual sync endpoint for existing users or fallback
authrouter.post("/sync-user", clerkAuth, async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const { firstName, lastName, emailId } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: clerkUserId });
    
    if (existingUser) {
      return res.status(200).json({ 
        message: "User already exists", 
        user: existingUser 
      });
    }
    
    // Create new user
    const newUser = new User({
      clerkId: clerkUserId,
      FirstName: firstName || "User",
      LastName: lastName || "",
      emailId: emailId || "",
    });
    
    await newUser.save();
    
    res.status(201).json({ 
      message: "User synced successfully", 
      user: newUser 
    });
  } catch (error) {
    console.error("❌ Manual sync error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get current user info - this will work after user is synced
authrouter.get("/me", requireClerkAuth, async (req, res) => {
  try {
    res.json({ 
      success: true,
      user: req.user 
    });
  } catch (error) {
    console.error("❌ Get user error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Check auth status
authrouter.get("/auth-status", clerkAuth, async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const user = await User.findOne({ clerkId: clerkUserId });
    
    res.json({
      authenticated: true,
      clerkUserId: clerkUserId,
      userSynced: !!user,
      user: user
    });
  } catch (error) {
    console.error("❌ Auth status error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Comprehensive test endpoint for debugging
authrouter.get("/test-integration", requireClerkAuth, async (req, res) => {
  try {
    const user = req.user;
    const clerkUserId = req.clerkUserId;
    
    // Test various queries that the feed/connections/requests will use
    const allUsers = await User.find({}).limit(5);
    const userCount = await User.countDocuments();
    
    res.json({
      success: true,
      message: "Integration test successful",
      data: {
        currentUser: {
          id: user._id,
          clerkId: user.clerkId,
          name: `${user.FirstName} ${user.LastName}`,
          email: user.emailId
        },
        clerkUserId: clerkUserId,
        databaseStats: {
          totalUsers: userCount,
          sampleUsers: allUsers.map(u => ({
            id: u._id,
            name: `${u.FirstName} ${u.LastName}`,
            clerkId: u.clerkId
          }))
        },
        authMiddleware: "Working",
        mongoConnection: "Working"
      }
    });
  } catch (error) {
    console.error("❌ Integration test error:", error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = authrouter;
