require('dotenv').config();
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");


// Configure CORS to work with Clerk
app.use(cors({
    origin: [
        "https://devtinder-web-5xd8.onrender.com",
        "http://localhost:5173", // For local development
        "https://localhost:5173" // For HTTPS local development
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-clerk-session-id', 'Access-Control-Allow-Origin'],
    optionsSuccessStatus: 200 // For legacy browser support
}));

// Handle preflight requests explicitly
app.options('*', cors());

// JSON parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// Import routers
const authrouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/requests");
const userRouter = require("./router/user");
const uploadRouter = require("./router/upload");
const initializeSocket = require("./utils/socket");
const chatRouter = require('./router/chat');

// Mount routers with Express v5 compatibility
app.use(authrouter);
app.use(profileRouter);
app.use(requestRouter);
app.use(userRouter);
app.use(uploadRouter);
app.use(chatRouter);

const server = http.createServer(app);
initializeSocket(server);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        message: "DevTinder API is running with Clerk + MongoDB",
        timestamp: new Date().toISOString(),
        features: {
            clerk_auth: true,
            mongodb: true,
            webhooks: true
        }
    });
});

// Test endpoint to check if server is working
app.get("/", (req, res) => {
    res.json({
        message: "🚀 DevTinder API Server",
        status: "Running",
        endpoints: {
            health: "/health",
            auth_status: "/auth-status",
            me: "/me",
            auto_sync: "/auto-sync",
            profile: "/profile/view",
            feed: "/feed"
        }
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("🔥 Global error:", err);
    res.status(500).json({ 
        error: "Internal server error",
        message: process.env.NODE_ENV === 'development' ? err.message : "Something went wrong"
    });
});

// Connect to database and start server
connectDB()
    .then(() => {
        console.log("✅ Database connection established...");
        
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`🚀 Server is successfully listening on port ${PORT}!`);
            console.log(`🌐 Health check: http://localhost:${PORT}/health`);
            console.log(`🔐 Auth status: http://localhost:${PORT}/auth-status`);
            console.log(`📝 API docs: http://localhost:${PORT}/`);
        });
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    });
