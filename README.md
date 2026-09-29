# College Bus Tracking System

Real-time college bus tracking application with a React/Vite frontend, Node.js/Express API, MongoDB, and Socket.IO GPS updates.

## Project structure

- `backend/` — Express API, MongoDB models, JWT authentication, Socket.IO
- `frontend/college-bus-tracker-frontend/` — React/Vite application

## Requirements

- Node.js 18+ (20+ recommended)
- MongoDB (local or Atlas)

## Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/college_bus_tracker
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Start:

```bash
npm run dev
```

Health check: `http://localhost:5000/api/health`

## Frontend setup

```bash
cd frontend/college-bus-tracker-frontend
npm install
```

Create `.env` if needed:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Main flow

1. Driver registers.
2. Admin logs in and approves the driver.
3. Admin creates a bus and assigns the approved driver.
4. Driver logs in, starts a trip, and grants browser GPS permission.
5. GPS coordinates are sent over an authenticated Socket.IO connection.
6. Students can open a bus tracking page and receive live coordinates.

## Important security note

The original archive contained a real MongoDB connection string and a JWT secret in `backend/src/.env`. Those credentials have been removed from the fixed source package. If the original MongoDB password was real, rotate it in MongoDB Atlas immediately and use a new JWT secret.

## Fixes applied

- Fixed environment-file placement: dotenv now loads `backend/.env`.
- Removed the exposed database credentials and replaced them with `.env.example`.
- Added a safe localhost CORS fallback.
- Added a clear error when `MONGO_URI` is missing.
- Secured driver GPS Socket.IO events so a driver can only update a running trip belonging to that authenticated driver.
- Added frontend Socket.IO JWT authentication.
- Removed the dependency on `socket.connected` before emitting GPS updates, allowing Socket.IO to buffer events while connecting.


## Passenger authentication (added)

The application now supports a first-class `passenger` role.

### Passenger API
- `POST /api/auth/passenger/register`
  - `name`, `email`, `phone`, `studentId`, optional `college`, `password`
- `POST /api/auth/passenger/login`
  - `email`, `password`
- `GET /api/auth/passenger/me`
  - Bearer token required; passenger role only

Passenger passwords are hashed with bcrypt, email/student ID are unique, inactive accounts are blocked, and passenger JWTs carry the `passenger` role.

### Passenger frontend
- `/passenger/login`
- `/passenger/register`
- `/passenger`
- Passenger dashboard shows account details, active buses, live-bus count and direct links to tracking.
