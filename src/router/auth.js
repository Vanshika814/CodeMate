// This file contains Clerk webhook and auto-sync endpoints for user creation in MongoDB.
// POST /auto-sync: Upserts Clerk user into MongoDB after signup/login if not present.
// POST /webhook/user: Handles Clerk webhooks for user creation/update.
// POST /sync-user: Manual sync endpoint for fallback.
//
// These endpoints are required for Clerk <-> MongoDB user sync.
//
// See frontend AutoSync.jsx for how /auto-sync is called on 404 from /profile/view.

const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const { requireClerkAuth } = require("../middleware/auth");

// Base Clerk middleware for routes that need authentication
const clerkAuth = ClerkExpressRequireAuth();

// Webhook endpoint to sync users automatically when they sign up via Clerk
authRouter.post("/webhook/user", express.json(), async (req, res) => {
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
authRouter.post("/auto-sync", clerkAuth, async (req, res) => {
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
authRouter.post("/sync-user", clerkAuth, async (req, res) => {
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
authRouter.get("/me", requireClerkAuth, async (req, res) => {
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
authRouter.get("/auth-status", clerkAuth, async (req, res) => {
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
authRouter.get("/test-integration", requireClerkAuth, async (req, res) => {
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

module.exports = authRouter;
