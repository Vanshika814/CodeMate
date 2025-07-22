# CodeMate Backend 👩‍💻❤️‍🔥

A platform connecting developers based on their skills, projects, and interests. CodeMate API provides the backend infrastructure for user authentication, profile management, connection requests, real-time chat, and more. It aims to solve the problem of finding and connecting with like-minded developers for collaboration, networking, and mentorship opportunities.

## 🚀 Key Features

- **User Authentication:** Secure user authentication and management using Clerk.
- **Profile Management:** Create, view, and edit developer profiles with skills, projects, and social links.
- **Connection Requests:** Send, accept, and reject connection requests to build your network.
- **Real-time Chat:** Engage in real-time conversations with other developers using WebSockets.
- **Image Uploads:** Upload project and profile images to Cloudinary.
- **User Feed:** Discover new developers based on your interests and connections.
- **API Health Check:** Provides a health check endpoint to monitor the API status.

## 🛠️ Tech Stack

*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB, Mongoose
*   **Authentication:** Clerk
*   **Real-time Communication:** Socket.IO
*   **Cloud Storage:** Cloudinary
*   **Environment Variables:** Dotenv
*   **CORS:** Cors
*   **Cookie Parsing:** Cookie-parser
*   **Validation:** validator
*   **Cryptography:** bcrypt, jsonwebtoken, crypto (Node.js built-in)

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB account and connection string
- Clerk account and API keys
- Cloudinary account and API keys
- `npm` or `yarn` package manager

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  Configure environment variables:

    - Create a `.env` file in the root directory.
    - Add the following environment variables, replacing the placeholders with your actual values:

    ```
    DB_CONNECTION_STRING=<your_mongodb_connection_string>
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    CLERK_SECRET_KEY=<your_clerk_secret_key>
    JWT_SECRET=<your_jwt_secret>
    FRONTEND_URL=<your_frontend_url> # e.g., https://devtinder.render.com
    ```

### Running Locally

1.  Start the server:

    ```bash
    npm start
    # or
    yarn start
    ```

2.  The API server will be running on `http://localhost:<PORT>` (default port is likely 3000, check your `app.js`).

## 📂 Project Structure

```
├── src/
│   ├── app.js             # Main entry point for the API server
│   ├── config/
│   │   └── database.js    # MongoDB database connection configuration
│   ├── middleware/
│   │   └── auth.js        # Authentication middleware using Clerk
│   ├── models/
│   │   ├── chat.js        # Mongoose model for chat messages
│   │   ├── connectionrequest.js # Mongoose model for connection requests
│   │   └── user.js        # Mongoose model for user data
│   ├── router/
│   │   ├── auth.js        # Authentication routes (Clerk webhooks, sync)
│   │   ├── chat.js        # Chat routes
│   │   ├── profile.js     # Profile routes (view, edit)
│   │   ├── requests.js    # Connection request routes (send, review)
│   │   ├── upload.js      # Image upload routes (Cloudinary)
│   │   └── user.js        # User routes (requests, connections, feed)
│   ├── utils/
│   │   ├── cloudinary.js  # Cloudinary configuration
│   │   ├── socket.js      # WebSocket initialization and handling
│   │   └── validation.js  # Input validation functions
│   ├── .env               # Environment variables
│   └── package.json         # Project dependencies and scripts
│   └── README.md          # Project documentation
```

## 📸 Screenshots

(Add screenshots of the API endpoints in action here)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main repository.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 📬 Contact

Vanshika Agarwal - vanshikaagarwal781@gmail.com

## 💖 Thanks Message

Thank you for checking out the CodeMate API! We hope it helps you build amazing things.

This is written by [readme.ai](https://readme-generator-phi.vercel.app/).
