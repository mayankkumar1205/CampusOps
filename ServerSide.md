# File: app.js

Functions:

Initializes Express server and middleware (CORS, JSON parsing)

Connects to MongoDB using Mongoose

Loads environment variables via .env

Sets up Socket.IO for real-time complaint updates

Handles user connection and live complaint notifications

Starts the server on the specified port

Key Points:

Uses express for backend framework

Uses mongoose for database connection

Uses socket.io for live updates between users and admins

Loads config securely using dotenv

Server listens on PORT from .env

# File: config/db.js

Functions:

Establishes MongoDB connection using Mongoose

Handles connection success or failure

Logs connection status in console

Key Points:

Centralized DB connection for better reusability

Uses process.env.MONGO_URI for connection string

Exports a single connect function for use in app.js

# File: routes/auth.js

Functions:

Defines routes for registration, login, and user profile

Protects private routes using authMiddleware

Provides endpoints for admin to view staff list

Key Points:

Uses express.Router() for modular route handling

Imports controllers for logic separation

Includes role-based protection using isAdmin middleware

