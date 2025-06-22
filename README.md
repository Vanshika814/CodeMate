# DevTinder

DevTinder is a platform designed to connect developers, enabling them to network, collaborate, and discover new opportunities. It allows users to create profiles, send connection requests, and manage their professional relationships.

## Core Features

*   *User Authentication:* Secure user registration, login, and logout functionality using JWT tokens and bcrypt for password hashing.
*   *User Profiles:* Create and manage user profiles with details like name, age, photo, about, and skills.
*   *Connection Requests:* Send, receive, accept, and reject connection requests between users.
*   *User Feed:* Discover new users to connect with based on connection status.
*   *Profile Viewing and Editing:* Ability to view and edit user profile information.

## Project Structure


DevTinder/
├── src/
│   ├── app.js                  # Main entry point: initializes the Express server, database connection, and routes.
│   ├── config/
│   │   └── database.js         # Establishes the MongoDB database connection.
│   ├── middleware/
│   │   └── auth.js             # Authentication middleware using JWT tokens.
│   ├── models/
│   │   ├── user.js             # Defines the User Mongoose schema and model.
│   │   └── connectionrequest.js# Defines the ConnectionRequest Mongoose schema and model.
│   ├── router/
│   │   ├── auth.js             # Authentication routes (signup, login, logout).
│   │   ├── profile.js          # User profile routes (view, edit).
│   │   ├── requests.js         # Connection request routes (send, review).
│   │   └── user.js             # User routes (received requests, connections, feed).
│   ├── utils/
│   │   └── validation.js       # Data validation utilities for user input.
├── package.json            # Lists project dependencies and scripts.
├── README.md               # Project documentation.


## Setup Instructions

1.  *Clone the repository:*

    bash
    git clone <repository_url>
    cd DevTinder
    

2.  *Install dependencies:*

    bash
    npm install
    

3.  *Configure the database:*

    *   Set up a MongoDB Atlas cluster and database.
    *   Update the connection string in src/config/database.js with your MongoDB Atlas connection details.

4.  *Start the server:*

    bash
    npm start
    

    The server will start listening on port 3000 (or the port specified in your environment).

## API Endpoints

Refer to the individual router files (src/router) for detailed information about available API endpoints and their usage. Key endpoints include:

*   /auth/signup: User registration.
*   /auth/login: User login.
*   /auth/logout: User logout.
*   /profile/view: Retrieve user profile.
*   /profile/edit: Edit user profile.
*   /request/send/:status/:toUserId: Send a connection request.
*   /request/review/:status/:requestId: Review a connection request.
*   /user/request/received: Get received connection requests.
*   /user/user/connections: Get user connections.
*   /user/feed: Get user feed.

## Technologies Used

*   Node.js
*   Express.js
*   MongoDB
*   Mongoose
*   JSON Web Tokens (JWT)
*   bcrypt
*   validator
*   cors
*   cookie-parser
