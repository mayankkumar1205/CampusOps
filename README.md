# DSCE Campus Complaint System

A full-stack campus complaint app for Dayananda Sagar College of Engineering. Students report and track issues, admins manage staff and assignments, and staff post progress updates. Connected dashboards receive changes in real time.

## Features

- Role-based student, staff, and admin access with JWT authentication.
- Complaint submission with category, due date, description, and optional image.
- Admin tools for staff account creation, assignments, workload, and status updates.
- Staff progress notes and optional photos.
- Complaint history, student feedback, email notifications, and Socket.IO live updates.

## Technology

React 17, React Router 5, Bootstrap 5, Axios, Socket.IO Client, Node.js, Express, MongoDB, Mongoose, JWT, Multer, and Nodemailer.

## Run locally

You need Node.js, npm, and a MongoDB database (local or Atlas).

1. Clone https://github.com/mayankkumar1205/CampusOps.git
2. Install server dependencies: from the server folder run npm install.
3. Install client dependencies: from the client folder run npm install.
4. Create server/.env with your own values for MONGO_URI, JWT_SECRET, PORT=5000, ADMIN_EMAIL, ADMIN_PASSWORD, and CLIENT_ORIGIN=http://localhost:3000. EMAIL_USER and EMAIL_PASS are optional.
5. In separate terminals, run npm start from server and client.
6. Open http://localhost:3000. Local API defaults to http://localhost:5000/api.

Never commit .env or put secrets in frontend variables. Use an email app password, not your regular email password.

## Roles

- Student: self-registers, submits complaints, tracks progress, and can leave feedback.
- Admin: signs in with ADMIN_EMAIL and ADMIN_PASSWORD; creates staff accounts, assigns complaints, and updates status.
- Staff: uses an account created by an admin to see assignments and post progress.

Staff and admin accounts cannot be publicly registered. See DEMO.md for a short presentation walkthrough.

## Deploy on Render

Deploy the API and frontend as separate services from the same GitHub repository. Use MongoDB Atlas or another MongoDB database reachable by the API.

### Backend API (Web Service)

In Render choose New > Web Service, connect mayankkumar1205/CampusOps, and set:

| Setting | Value |
| --- | --- |
| Branch | main |
| Root Directory | server |
| Build Command | npm install |
| Start Command | npm start |

In the backend Environment settings add MONGO_URI, JWT_SECRET, ADMIN_EMAIL, and ADMIN_PASSWORD. Add CLIENT_ORIGIN after deploying the frontend. EMAIL_USER and EMAIL_PASS are optional. Deploy, copy the backend URL, then open the backend URL plus /api/test. A working API returns JSON saying the server is working.

### Frontend (Static Site)

Choose New > Static Site and connect the same repository:

| Setting | Value |
| --- | --- |
| Branch | main |
| Root Directory | client |
| Build Command | npm install && npm run build |
| Publish Directory | build |

Add build variable REACT_APP_API_URL with the backend URL ending in /api, for example https://your-api.onrender.com/api. React embeds this value during build, so redeploy the frontend after changes. Socket.IO derives its address automatically.

In Redirects/Rewrites, add a Rewrite from /* to /index.html so React Router pages work when refreshed directly.

### Connect and verify

1. Copy the frontend origin, such as https://your-site.onrender.com, without a trailing slash.
2. Set backend CLIENT_ORIGIN to that exact origin, save, and redeploy.
3. Check the backend /api/test endpoint.
4. Register a test student and submit a complaint.
5. As admin, assign it to a staff account.
6. As staff in another browser, post an update and confirm the other dashboard updates.
7. Resolve the complaint as admin and confirm the student's view changes.
8. Refresh a direct route such as /my-complaints.

See Render's Node/Express guide at https://render.com/docs/deploy-node-express-app and Create React App guide at https://render.com/docs/deploy-create-react-app.

## Deployment limitations

- Images currently save to server/uploads. Render's default filesystem is temporary, so uploaded images can disappear after restarts or deploys. Avoid relying on image evidence until uploads use durable storage.
- The app sends email via Gmail SMTP on port 587. Render Free blocks outbound SMTP, so emails will not work on that plan.
- A free backend may sleep while idle; open the API/site before presenting.

See https://render.com/docs/free. Keep credentials only in hosting environment settings.

## API overview

- Auth: POST /api/auth/register (student), POST /api/auth/login, POST /api/auth/staff (admin creates staff), GET /api/auth/staff (admin list).
- Complaints: POST /api/complaints, GET /api/complaints/my, GET /api/complaints (admin), GET /api/complaints/assigned (staff), PUT /api/complaints/:id/assign, PUT /api/complaints/:id/status, POST /api/complaints/:id/staff-update.
- Stats: GET /api/stats/complaints and GET /api/stats/users. Feedback routes are under /api/feedback.
- Protected endpoints require Authorization: Bearer <token>.

## Project structure

- client/ — React frontend.
- server/ — Express API, Socket.IO server, and MongoDB models.
- ClientSide.md and ServerSide.md — implementation notes.
- DEMO.md — presentation checklist and talk track.
