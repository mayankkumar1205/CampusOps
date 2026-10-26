# Client-side overview

The React application lives in client/src.

## Application shell

### src/App.jsx
- Sets up React Router and role-protected routes for student, staff, and admin pages.
- Restores the logged-in user from the JWT stored in local storage.
- Connects or disconnects the shared Socket.IO client as authentication changes.
- Renders the shared navigation bar.

### src/components/Navbar.jsx
Shows the Dayananda Sagar College of Engineering brand, role-specific navigation, profile details, and logout action.

## API and live updates

### src/api/config.js
Defines the shared API base URL. Set REACT_APP_API_URL in the client environment for a hosted backend; local development defaults to http://localhost:5000/api.

### src/api/auth.js
Provides reusable registration and login API calls.

### src/api/socket.js
Creates the authenticated Socket.IO client. It sends the current JWT to the server and is shared by the app and dashboard listeners.

## Main screens

- src/pages/Home.jsx: landing page, public feedback, and public system statistics.
- src/pages/MyComplaints.jsx: a student's complaints, live status refresh, feedback, and summary counts.
- src/pages/ComplaintDetail.jsx: one complaint with its status timeline and live refresh.
- src/pages/AdminDashboard.jsx: staff account creation, staff workload, complaint assignment, status controls, and live complaint refresh.
- src/pages/StaffDashboard.jsx: assigned complaints, progress updates with optional photos, and live refresh.
- src/components/Auth/Login.jsx and Register.jsx: role-aware login and student registration.

Global visual styles are in src/index.css. The college name, page title, and browser icon are set in public/index.html and shared components.
