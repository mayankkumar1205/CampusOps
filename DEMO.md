# Campus Complaint System demo

## Before presenting

- Open the frontend and backend URLs once; a free backend may need time to wake.
- Check the backend URL plus /api/test.
- Prepare temporary student and staff accounts. Admin credentials are in backend environment settings.
- Use a fictional complaint such as “Water leak near the library.” Never show real student details or confidential issues.
- Use separate browser profiles or private windows for student, admin, and staff.
- Avoid relying on images because uploads use temporary server storage.

## Five-minute walkthrough

### 1. Introduce the problem
“Campus issues can be hard to follow when reports are scattered. This app gives students, staff, and admins one shared workflow.”

### 2. Student reports an issue
Sign in as student, submit a complaint with title, category, description, and due date, then open My Complaints.

Say: “Students get a record of the issue and can track its progress.”

### 3. Admin routes it
Sign in as admin in another browser. Create a staff account if needed, assign the complaint, and show workload and status controls.

Say: “Admins can route work to a responsible staff member and keep progress visible.”

### 4. Staff shares progress
Sign in as that staff member in another browser and add a progress note. Return to the student or admin screen and show the live update.

Say: “Connected dashboards receive progress without a manual refresh.”

### 5. Admin resolves it
As admin, mark the complaint resolved and add a brief note. Return to the student page and show its status. Submit feedback if time allows.

Say: “The workflow records the outcome and gives students a way to share feedback.”

## Troubleshooting

- API does not load: check the Render deploy status/logs and MongoDB connection.
- Network/CORS error: frontend REACT_APP_API_URL must end in /api; backend CLIENT_ORIGIN must exactly match the frontend origin.
- Direct route fails after refresh: check the Static Site rewrite from /* to /index.html.
- Live updates fail: sign in again and check backend logs for socket connections.
- Email fails: Render Free blocks SMTP; continue without email.
- Image missing: uploads use temporary storage; do an image-free demo.

Use fictitious complaints and temporary credentials. Remove or rotate demo accounts after presenting.

