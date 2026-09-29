# College Bus Tracker Frontend

React + Vite frontend for the supplied Express/MongoDB/Socket.IO backend.

## Features
- Public live bus list and map
- Real-time bus tracking with Socket.IO
- Driver registration/login
- Driver dashboard with browser GPS sharing
- Start/stop trip controls
- Admin login
- Driver approval
- Bus creation
- Driver-to-bus assignment
- Bus deactivation
- Responsive mobile UI

## Run

1. Start your backend:
   `cd backend && npm install && npm run dev`

2. Create this frontend:
   `npm install`

3. Copy `.env.example` to `.env`:
   `VITE_API_URL=http://localhost:5000/api`
   `VITE_SOCKET_URL=http://localhost:5000`

4. Start:
   `npm run dev`

Open http://localhost:5173

## Backend fixes included in the recommended setup
Your uploaded backend has a trailing backtick in `backend/src/.env`:
`CLIENT_URL=http://localhost:5173\` 
Remove the trailing backtick.

Also make sure the backend has:
`CLIENT_URL=http://localhost:5173`

For production, replace the MongoDB credentials in `.env` and use a strong JWT secret.

## Important GPS note
Browser geolocation normally requires HTTPS in production. `localhost` is allowed for development.

## Admin account
The supplied backend has admin login but no admin registration route. Create the first admin directly in MongoDB (with a bcrypt-hashed password), then use the admin login screen.

## API contract used
- POST `/api/auth/driver/register`
- POST `/api/auth/driver/login`
- POST `/api/auth/admin/login`
- GET `/api/public/buses`
- GET `/api/public/buses/:id`
- GET `/api/driver/dashboard`
- POST `/api/driver/trips/start`
- POST `/api/driver/trips/:id/stop`
- GET `/api/admin/drivers`
- PATCH `/api/admin/drivers/:id/approve`
- GET `/api/admin/buses`
- POST `/api/admin/buses`
- PATCH `/api/admin/buses/:id/assign`
- PATCH `/api/admin/buses/:id/deactivate`

Socket events:
- `track:join`
- `driver:location`
- `bus:location`
