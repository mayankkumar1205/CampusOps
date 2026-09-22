# Smart Campus Complaint Management System - Client README

## Project Overview

This project is a Smart Campus Complaint Management System built using the MERN stack (MongoDB, Express, React, Node.js). The focus of Phase 1 is on Authentication and User Management.

## Project Structure

The client-side of the application is structured as follows:

```
client
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── Auth
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── Navbar.jsx
│   ├── pages
│   │   ├── Home.jsx
│   │   └── Profile.jsx
│   ├── App.jsx
│   ├── index.jsx
│   └── api
│       └── auth.js
├── package.json
└── README.md
```

## Getting Started

To set up and run the project, follow these steps:

1. **Install Node.js and npm** if you haven't already.
2. **Set up MongoDB** (either locally or via MongoDB Atlas).
3. **Create the project directory and navigate into it:**
   ```
   mkdir smart-campus-complaint-system
   cd smart-campus-complaint-system
   ```
4. **Create the React client:**
   ```
   npx create-react-app client
   ```
5. **Navigate to the server directory and initialize it:**
   ```
   mkdir server
   cd server
   npm init -y
   ```
6. **Install the necessary server dependencies:**
   ```
   npm install express mongoose dotenv cors bcryptjs jsonwebtoken multer socket.io
   ```
7. **Navigate to the client directory and install the necessary client dependencies:**
   ```
   cd ../client
   npm install axios react-router-dom
   ```
8. **To run the server, navigate to the server directory and run:**
   ```
   node app.js
   ```
9. **To run the client, navigate to the client directory and run:**
   ```
   npm start
   ```

This will start both the server and the client, allowing you to begin development on Phase 1: Authentication & User Management.

## Features

- User Registration
- User Login
- Profile Management
- Navigation Bar

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.