<h1 align="center">Smart Campus Complaint System</h1>

<div align="center">

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-17.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green)
![License](https://img.shields.io/badge/License-MIT-blue)

**A comprehensive complaint management platform for educational institutions with role-based access control, real-time tracking, and automated workflows.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

##  Screenshots

<div align="center">
  <img 
    src="https://github.com/user-attachments/assets/48127d29-d387-4ce2-85cb-0a2356d05b18"
    alt="Smart Campus Complaint System Landing Page"
    width="900"
  />
  <p><i>Smart Campus Complaint System – Landing Page</i></p>
</div>


---

## 📋 Table of Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

Smart Campus Complaint System is a full-stack web application designed to streamline complaint management in educational institutions. The platform enables students to submit complaints with multimedia attachments, allows staff members to track and resolve assigned issues, and provides administrators with comprehensive oversight through analytics and management tools.

The system implements a three-tier role-based access control (Student, Staff, Admin) with JWT authentication, real-time status updates, automated email notifications, and a feedback mechanism for continuous improvement.

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Role-Based Access Control** - Separate authentication flows for Students, Staff, and Administrators
- **JWT Token Management** - Secure session handling with JSON Web Tokens
- **Password Encryption** - bcryptjs hashing for secure credential storage
- **Protected Routes** - Middleware-based route protection based on user roles

### 📝 Complaint Management
- **Complaint Submission** - Create complaints with title, description, category, urgency level, and image attachments
- **Status Tracking** - Three-tier status workflow: `pending` → `in-progress` → `resolved`
- **Image Upload** - Multer-based file handling for complaint evidence
- **Urgency Levels** - Configurable due dates (1, 2, or 3+ days)

### 👥 Staff Operations
- **Assigned Complaints Dashboard** - View and manage complaints assigned to staff members
- **Progress Updates** - Add photos and remarks during complaint resolution
- **Status Updates** - Update complaint status with detailed notes

### 👨‍💼 Admin Dashboard
- **Complaint Overview** - View all complaints with filtering and search capabilities
- **Staff Assignment** - Assign complaints to available staff members
- **Statistics & Analytics** - Real-time metrics on complaints, users, and resolution times
- **User Management** - Access to staff and student user lists

### 💬 Feedback System
- **Rating System** - 5-star rating mechanism for resolved complaints
- **Comments** - Textual feedback submission
- **Performance Tracking** - Monitor staff and system performance

### 📧 Notifications
- **Email Integration** - Automated email notifications via Nodemailer
- **Resolution Alerts** - Notify users when complaints are resolved

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 17.0.2 | UI framework |
| **React Router DOM** | 5.3.4 | Client-side routing |
| **Axios** | 0.21.4 | HTTP client for API calls |
| **Bootstrap** | 5.3.7 | CSS framework for responsive design |
| **JWT Decode** | 4.0.0 | Token decoding for authentication |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express.js** | 4.21.2 | Web application framework |
| **Mongoose** | 5.13.23 | MongoDB object modeling |
| **jsonwebtoken** | 8.5.1 | JWT token generation and verification |
| **bcryptjs** | 2.4.3 | Password hashing |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| **MongoDB** | 5.0+ | NoSQL database for data persistence |

### Tools & Utilities
| Technology | Version | Purpose |
|------------|---------|---------|
| **Multer** | 1.4.2 | File upload middleware |
| **Nodemailer** | 7.0.4 | Email service integration |
| **Socket.io** | 4.0.0 | Real-time bidirectional communication |
| **dotenv** | 10.0.0 | Environment variable management |
| **CORS** | 2.8.5 | Cross-origin resource sharing |

---

## 🏗 Architecture

The application follows a **three-tier architecture** pattern:

```
┌─────────────────┐
│   React Client  │  (Port 3000)
│   (Frontend)    │
└────────┬────────┘
         │ HTTP/REST API
         │ (Axios)
┌────────▼────────┐
│  Express Server │  (Port 5000)
│   (Backend)     │
└────────┬────────┘
         │ Mongoose ODM
┌────────▼────────┐
│    MongoDB      │
│   (Database)    │
└─────────────────┘
```

**Data Flow:**
1. **Frontend (React)** - User interactions trigger API calls via Axios
2. **Backend (Express)** - RESTful API endpoints handle business logic and authentication
3. **Database (MongoDB)** - Data persistence with Mongoose schemas
4. **Authentication** - JWT tokens stored in localStorage, validated via middleware
5. **File Storage** - Multer processes uploads to `server/uploads/` directory
6. **Email Service** - Nodemailer sends notifications asynchronously

---

## 📦 Prerequisites

Before installation, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/tharani-2006/smart-campus-complaint-system.git
cd smart-campus-complaint-system
```

### 2. Install Dependencies

Install server dependencies:

```bash
cd server
npm install
```

Install client dependencies:

```bash
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd ../server
touch .env
```

Add the following environment variables (see [Configuration](#-configuration) for details):

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
ADMIN_EMAIL=admin@campus.edu
ADMIN_PASSWORD=secure_admin_password
```

### 4. Start MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

**MongoDB Atlas:**
- Use your Atlas connection string in `MONGO_URI`

### 5. Run the Application

**Start the backend server:**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Start the frontend client (in a new terminal):**
```bash
cd client
npm start
# Client runs on http://localhost:3000
```

The application will automatically open in your default browser at `http://localhost:3000`.

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `server` directory with the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/campus-complaints` or Atlas URI |
| `JWT_SECRET` | Secret key for JWT token signing | `your_super_secret_jwt_key_here` |
| `PORT` | Server port number | `5000` |
| `EMAIL_USER` | Email address for sending notifications | `noreply@campus.edu` |
| `EMAIL_PASS` | Email service app password | `your_app_specific_password` |
| `ADMIN_EMAIL` | Default admin email for login | `admin@campus.edu` |
| `ADMIN_PASSWORD` | Default admin password | `SecurePassword123!` |

### MongoDB Connection

**Local MongoDB:**
```env
MONGO_URI=mongodb://localhost:27017/smart-campus-complaints
```

**MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-campus-complaints?retryWrites=true&w=majority
```

### Email Configuration (Gmail Example)

1. Enable 2-Step Verification on your Google Account
2. Generate an App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use the generated password in `EMAIL_PASS`

---

## 💻 Usage

### User Roles

#### 👨‍🎓 Student
- Register/Login at `/register/student` or `/login/student`
- Submit new complaints at `/complaints/new`
- View personal complaints at `/my-complaints`
- Track complaint status and updates
- Submit feedback on resolved complaints

#### 👨‍🏫 Staff
- Register/Login at `/register/staff` or `/login/staff`
- Access dashboard at `/staff/dashboard`
- View assigned complaints
- Update complaint status with photos and remarks
- Track resolution progress

#### 👨‍💼 Administrator
- Login at `/login/admin` (credentials from `.env`)
- Access admin dashboard at `/admin/dashboard`
- View all complaints across the system
- Assign complaints to staff members
- Update complaint statuses
- View statistics and analytics
- Manage user accounts

### API Endpoints

See [API Documentation](#-api-documentation) for complete endpoint details.

---

## 📁 Project Structure

```
smart-campus-complaint-system/
│
├── client/                          # React frontend application
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── src/
│   │   ├── api/
│   │   │   └── auth.js             # API service functions
│   │   ├── assets/
│   │   │   └── logo.jpeg           # Application logo
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx       # Login component
│   │   │   │   └── Register.jsx   # Registration component
│   │   │   ├── Complaint/
│   │   │   │   └── ComplaintForm.jsx  # Complaint submission form
│   │   │   └── Navbar.jsx          # Navigation bar
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx  # Admin dashboard page
│   │   │   ├── CenterPage.jsx      # Center page component
│   │   │   ├── ComplaintDetail.jsx # Complaint details view
│   │   │   ├── Home.jsx            # Home page
│   │   │   ├── MyComplaints.jsx    # User's complaints list
│   │   │   └── StaffDashboard.jsx  # Staff dashboard page
│   │   ├── App.jsx                 # Main application component
│   │   ├── index.jsx               # Application entry point
│   │   └── index.css               # Global styles
│   ├── package.json                # Frontend dependencies
│   └── README.md                   # Client-specific README
│
├── server/                          # Express backend application
│   ├── config/
│   │   └── db.js                   # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   ├── complaintController.js  # Complaint business logic
│   │   └── feedbackController.js   # Feedback handling
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT authentication middleware
│   │   ├── isAdmin.js              # Admin role verification
│   │   ├── isStaff.js              # Staff role verification
│   │   └── upload.js               # Multer file upload configuration
│   ├── models/
│   │   ├── Complaint.js            # Complaint data model
│   │   ├── Feedback.js             # Feedback data model
│   │   └── User.js                 # User data model
│   ├── routes/
│   │   ├── auth.js                 # Authentication routes
│   │   ├── complaint.js            # Complaint routes
│   │   ├── feedback.js             # Feedback routes
│   │   └── stats.js                # Statistics routes
│   ├── uploads/                    # Uploaded files directory
│   ├── utils/
│   │   ├── emailTest.js            # Email testing utility
│   │   └── mailer.js               # Email service configuration
│   ├── app.js                      # Express application entry point
│   ├── package.json                # Backend dependencies
│   └── .env                        # Environment variables (not in repo)
│
├── Docs/                            # Documentation
│   ├── ClientSide.md               # Client-side documentation
│   └── ServerSide.md               # Server-side documentation
│
├── .gitignore                       # Git ignore rules
├── package.json                     # Root package.json
└── README.md                        # This file
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@student.edu",
  "password": "password123",
  "department": "Computer Science",
  "role": "student"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@student.edu",
  "password": "password123",
  "role": "student"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Complaint Endpoints

#### Create Complaint
```http
POST /api/complaints
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Broken Wi-Fi in Library",
  "description": "Wi-Fi connection is unstable",
  "category": "Infrastructure",
  "dueInDays": 2,
  "image": <file>
}
```

#### Get User's Complaints
```http
GET /api/complaints/my
Authorization: Bearer <token>
```

#### Get All Complaints (Admin)
```http
GET /api/complaints
Authorization: Bearer <token>
```

#### Get Complaint by ID
```http
GET /api/complaints/:id
Authorization: Bearer <token>
```

#### Assign Complaint to Staff
```http
PUT /api/complaints/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "staffId": "staff_user_id"
}
```

#### Update Complaint Status
```http
PUT /api/complaints/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress"
}
```

#### Staff Update Complaint
```http
POST /api/complaints/:id/staff-update
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "remarks": "Issue resolved",
  "photo": <file>
}
```

### Statistics Endpoints

#### Get Complaint Statistics
```http
GET /api/stats/complaints
```

#### Get User Statistics
```http
GET /api/stats/users
```

### Feedback Endpoints

#### Submit Feedback
```http
POST /api/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "complaintId": "complaint_id",
  "rating": 5,
  "comment": "Excellent service!"
}
```

---

## 🚢 Deployment

### Backend Deployment (Render/Heroku)

1. **Set Environment Variables** in your hosting platform
2. **Update MongoDB URI** to production database
3. **Configure CORS** to allow frontend domain
4. **Deploy:**

```bash
cd server
git push heroku main
# or
# Deploy to Render via GitHub integration
```

### Frontend Deployment (Vercel/Netlify)

1. **Update API Base URL** in `client/src/api/auth.js`
2. **Build the application:**

```bash
cd client
npm run build
```

3. **Deploy the `build` folder** to your hosting platform

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform's dashboard.

---

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
Error: MongoDB connection failed
```
**Solution:** Verify `MONGO_URI` in `.env` file and ensure MongoDB is running.

#### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution:** Change `PORT` in `.env` or kill the process using the port:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill
```

#### JWT Token Expired
```
Error: Token expired
```
**Solution:** Log out and log in again to generate a new token.

#### File Upload Fails
```
Error: Multer error
```
**Solution:** Ensure `server/uploads/` directory exists and has write permissions.

#### CORS Error
```
Error: CORS policy blocked
```
**Solution:** Verify CORS is enabled in `server/app.js` and frontend URL is whitelisted.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write clear commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 🙏 Acknowledgments

- MongoDB for the database solution
- React team for the amazing framework
- Express.js community for the robust backend framework
- All contributors and users of this project

---

<div align="center">

**Made with ❤️ by tharani-2006**

⭐ Star this repo if you find it helpful!

</div>
