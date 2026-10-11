# Employee Portal Backend Business Requirements

## 1. Purpose and Scope

This document describes business capabilities inferred from the current employee-portal implementation. It covers the Angular 20 frontend, HTTP API, database-backed workflows, and WebSocket events present in this repository. It is an implementation-derived draft, not a stakeholder-approved specification. Items needing business or security decisions are listed in [Open Questions and Gaps](#10-open-questions-and-gaps).

The frontend is a standalone Angular 20 application in `frontend/`. The backend is built with NestJS and Prisma and uses a MySQL database.

## 2. User and Role Management

- **BR-USER-01:** The system shall create employee records. The create request requires first name, username, password, joining date, phone number, and national ID. Last name, father name, office email, role, address, profile image, designation, and team lead can be provided optionally.
- **BR-USER-02:** The system shall return a list of employee records.
- **BR-USER-03:** The system shall retrieve an employee's non-password profile details by employee ID.
- **BR-USER-04:** The system shall allow employee records to be updated by employee ID.
- **BR-USER-05:** The system shall list potential team leads for a supplied role. The current logic selects employees whose role has a greater numeric scale than the supplied role.
- **BR-ROLE-01:** The system shall create roles with a unique title, numeric scale, and permissions.
- **BR-ROLE-02:** The system shall list roles and return their permission values.
- **BR-ROLE-03:** The system shall retrieve and update a role by role ID.
- **BR-ROLE-04:** The system shall expose the role-scale choices `1`, `2`, `3`, `4`, and `5`.
- **BR-ROLE-05:** Role permissions are stored as comma-separated text, returned as a list by the role list endpoint, and converted to permission flags in session responses.

## 3. Authentication and Session Management

- **BR-AUTH-01:** The system shall authenticate a user by username and password, rejecting unknown usernames and mismatched credentials.
- **BR-AUTH-02:** On successful login, the system shall mark the employee as logged in and return a session profile with role permissions.
- **BR-AUTH-03:** If no session exists when a user logs in, the system shall create a session based on the employee's profile.
- **BR-AUTH-04:** The system shall retrieve session data using a supplied token.
- **BR-AUTH-05:** The system shall log out a user by employee ID, update the user's logged-in state, and remove that user's session.
- **BR-AUTH-06:** Session data may include attendance status and check-in information when the user is checked in.

## 4. Attendance Management

- **BR-ATT-01:** The system shall record an employee check-in with employee ID, attendance date, and check-in time.
- **BR-ATT-02:** Recording a check-in shall set the employee and their session to checked-in and include the check-in date and time.
- **BR-ATT-03:** The system shall record a check-out for an existing attendance record matching the employee ID and attendance date.
- **BR-ATT-04:** A check-out request without a matching check-in shall be rejected.
- **BR-ATT-05:** A check-out shall clear the employee's checked-in state and attendance details from the session.
- **BR-ATT-06:** The system shall allow an attendance record to be updated by attendance ID.
- **BR-ATT-07:** The system shall return up to seven recent completed attendance records for an employee.

## 5. Reports and Team Views

- **BR-REPORT-01:** The system shall create a report for an employee using a report date and description.
- **BR-REPORT-02:** The system shall return up to ten reports for an employee, ordered by most recently updated.
- **BR-REPORT-03:** The system shall allow a report to be updated by report ID.
- **BR-TEAM-01:** The system shall list an employee's direct reports by team-lead ID.
- **BR-TEAM-02:** A team lead shall be able to retrieve direct reports' attendance for a selected day. The response includes direct reports who have no attendance record for that day, with attendance fields set to null.
- **BR-TEAM-03:** A team lead shall be able to retrieve direct reports' reports for a selected day. The response includes direct reports who have no report for that day, with report fields set to null.
- **BR-TEAM-04:** A team lead shall be able to retrieve direct reports' task progress for a selected day, grouped by employee and task and including recorded duration and active-task status.

## 6. Task and Subtask Management

- **BR-TASK-01:** The system shall create tasks with unique titles.
- **BR-TASK-02:** The system shall list tasks and retrieve or update an individual task by task ID.
- **BR-TASK-03:** An employee shall be able to start tracking time against a task.
- **BR-TASK-04:** When a new task track is started for an employee, the system intends to stop that employee's previously active task and calculate its duration.
- **BR-TASK-05:** The system shall retrieve an employee's active task, if one exists.
- **BR-TASK-06:** The system shall stop an active task track by task-track ID, recording its end time and duration. An invalid or inactive task-track ID shall be rejected.
- **BR-SUBTASK-01:** The system shall create and update subtasks in a bulk request associated with tasks.
- **BR-SUBTASK-02:** The system shall list non-deleted subtasks for a task.
- **BR-SUBTASK-03:** The system shall allow a subtask to be updated by subtask ID.

## 7. File Uploads

- **BR-UPLOAD-01:** The system shall accept one uploaded file in the multipart form field named `photo` and store it under the folder specified in the request path.
- **BR-UPLOAD-02:** The system shall return the stored path for an uploaded file.
- **BR-UPLOAD-03:** The system shall serve profile images by filename from the profile image directory.

## 8. Real-Time Events

- **BR-RT-01:** The system shall broadcast the current connected-client count when a WebSocket client connects or disconnects.
- **BR-RT-02:** The system shall relay a `chat` message to other connected clients.

## 9. HTTP Endpoint Catalogue

All HTTP routes are served on port `3000` by default. Swagger documentation is exposed at `/api`.

| Area | Method and path | Business operation |
| --- | --- | --- |
| General | `GET /` | Return the basic service response. |
| Users | `POST /api/user/createEmployee` | Create an employee. |
| Users | `GET /api/user/getEmployees` | List employees. |
| Users | `GET /api/user/getTeamLeads/:roleId` | List users with a higher-scale role. |
| Users | `GET /api/user/:id` | Retrieve an employee by ID. |
| Users | `PATCH /api/user/updateEmployee/:id` | Update an employee. |
| Authentication | `POST /api/auth/logIn` | Authenticate and return session data. |
| Authentication | `POST /api/auth/logOut` | Clear login state and remove session. |
| Authentication | `POST /api/auth/createSession` | Create a session. |
| Authentication | `POST /api/auth/session` | Retrieve session data using a token. |
| Attendance | `POST /api/attendence/checkIn` | Record an employee check-in. |
| Attendance | `POST /api/attendence/checkOut` | Record an employee check-out. |
| Attendance | `GET /api/attendence/getUserAttendence/:id` | Retrieve recent completed attendance for an employee. |
| Attendance | `PATCH /api/attendence/:id` | Update an attendance record. |
| Roles | `POST /api/settings/createRole` | Create a role. |
| Roles | `GET /api/settings/getScales` | Retrieve role-scale choices. |
| Roles | `GET /api/settings/getRoles` | List roles. |
| Roles | `GET /api/settings/getRole/:id` | Retrieve a role. |
| Roles | `PATCH /api/settings/updateRole/:id` | Update a role. |
| Reports | `POST /api/reports/createUserReport` | Create an employee report. |
| Reports | `GET /api/reports/getUserReport/:id` | List reports for an employee. |
| Reports | `PATCH /api/reports/updateReport/:id` | Update a report. |
| Team | `GET /api/team/getTeamMembers/:id` | List direct reports for a team lead. |
| Team | `GET /api/team/getTeamAttendence` | Retrieve team attendance for a date. |
| Team | `GET /api/team/getTeamReports` | Retrieve team reports for a date. |
| Team | `GET /api/team/getTeamProgress` | Retrieve team task progress for a date. |
| Tasks | `POST /api/tasks/createTask` | Create a task. |
| Tasks | `GET /api/tasks/getAllTasks` | List tasks. |
| Tasks | `GET /api/tasks/getTaskById/:id` | Retrieve a task. |
| Tasks | `PATCH /api/tasks/updateTask/:id` | Update a task. |
| Tasks | `POST /api/tasks/createTaskTrack` | Start tracking a task for an employee. |
| Tasks | `GET /api/tasks/userActiveTask/:id` | Retrieve an employee's active task. |
| Tasks | `POST /api/tasks/stopTask` | Stop an active task track. |
| Subtasks | `POST /api/subtasks/createSubTasks` | Create or update subtasks in bulk. |
| Subtasks | `GET /api/subtasks/getAllSubTasks/:id` | List non-deleted subtasks for a task. |
| Subtasks | `PATCH /api/subtasks/updateSubTask/:id` | Update a subtask. |
| Uploads | `POST /api/uploads/:folderName` | Upload a file to a requested folder. |
| Uploads | `GET /api/uploads/getImage/profile/:imgUrl` | Retrieve a profile image. |

### WebSocket Events

| Event | Behavior |
| --- | --- |
| `chat` | Accept a message and relay it to other connected clients. |
| `users` | Broadcast the current connection count when a client connects or disconnects. |

## 10. Open Questions and Gaps

These are implementation observations requiring a product, security, or operational decision. They are not approved business rules.

- **Authorization:** No authentication or role-authorization guards are applied to the HTTP controllers. Define which routes require a logged-in user and which role permissions grant access.
- **Credential and token security:** Login still compares stored passwords directly and the JWT signing secret is hard-coded. Password fields are omitted from employee and session responses, but password hashing, secret management, token verification and expiry still need definition before production use.
- **Session creation:** Session creation is exposed as a standalone endpoint. Decide whether clients may create sessions directly or whether session creation should only occur during login.
- **Attendance rules:** Define duplicate check-in behavior, repeated check-out behavior, overnight shifts, missed check-outs, time zone rules, and who may correct attendance.
- **Role hierarchy:** Define the valid role-scale range and confirm that greater numeric scale means greater authority.
- **Reports:** Define reporting deadlines, edit permissions, and whether multiple reports per employee per day are allowed.
- **Task tracking:** Define task assignment and concurrent active-task rules. Starting a new track now waits for any existing active track to close.
- **Date inputs:** Team date query parameters are optional in the controllers but used as Unix timestamps by the services. Define requiredness, accepted format, timezone, and invalid-date behavior.
- **Uploads:** Define allowed file types, maximum size, authorization, and acceptable folder names. The current upload route does not show file-type or size restrictions.
- **Deletion and data visibility:** Several data models have soft-delete flags, but delete behavior is not consistently exposed and list endpoints do not consistently filter deleted records. Define archive/delete rules and visibility.
- **Listing behavior:** Define pagination, sorting, and filtering requirements for employee, task, role, and team data.

## 11. Local Development

Requirements: Node.js/npm and a MySQL database. Set `DATABASE_URL` in the environment for Prisma before starting the service.

```bash
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

The API listens on port `3000` by default.

Start the frontend in a second terminal:

```bash
cd frontend
npm install
npm start
```

The frontend listens on port `4200` and connects to the API and Socket.IO server on port `3000`.

```bash
npm run build
npm test
npm run test:e2e
```
