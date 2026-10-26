# Server-side overview

The Express application and Socket.IO server start from server/app.js.

## Server setup

### app.js
- Loads environment variables, configures JSON parsing and CORS, and serves uploaded images.
- Connects to MongoDB through Mongoose.
- Registers the authentication, complaint, feedback, and statistics routers.
- Creates the HTTP server and Socket.IO server, authenticates socket connections with JWTs, and places users into their private notification rooms.
- Listens on PORT (default 5000).

The frontend origin is allowed through CLIENT_ORIGIN. Set it to the deployed client origin in production.

## Routes and permissions

### routes/auth.js
Provides registration and login, the authenticated profile route, the admin-only staff list, and the admin-only staff-account creation route.

### routes/complaint.js
Protects complaint routes with authentication and role or assignment middleware. Admins can review, assign, and change statuses. Students can submit complaints and view their own complaints. Staff can view assigned complaints and submit progress updates.

## Complaint data and real-time updates

### models/Complaint.js
Stores complaint details, owner and staff assignment, deadline, current status, status history, resolution notes, and staff updates.

### controllers/complaintController.js
Validates complaint creation, enforces access rules, updates assignment and status history, calculates statistics, and calls the event helper after saved changes.

### utils/complaintEvents.js
Sends complaint-created and complaint-updated events to admins, the complaint owner, and assigned staff. The client dashboards listen for these events and refresh their data.

Uploaded images are saved under server/uploads/ and served through the /uploads route. Environment files and uploaded files are excluded from Git.
