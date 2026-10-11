# Employee Portal frontend

An Angular 20 standalone frontend for the Employee Portal backend in the repository root.

## Run locally

Start the backend from the repository root (with `DATABASE_URL` configured):

```bash
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

Then start the frontend in `frontend/`:

```bash
npm install
npm start
```

The frontend is served at `http://localhost:4200` and calls the API at `http://localhost:3000/api`. The backend allows the local Angular origin for HTTP and Socket.IO connections.

## Current scope

The application includes sign-in/session restore, employee profile and administration, role management, check-in/out and attendance history/correction, employee reports, task timers and subtasks, team attendance/reports/progress, file uploads, and real-time chat. These pages call the NestJS endpoints in the business requirements.

The backend currently has no authentication or role authorization guards, and still uses plain-text password comparison and a hard-coded JWT secret. Treat this as a local development application until those backend security gaps are resolved.
