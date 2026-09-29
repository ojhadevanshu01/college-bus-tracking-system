# Backend changes to make

## backend/src/.env
Use:
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173

Do not put a trailing backtick after the CLIENT_URL.

## Optional security improvement
The current Socket.IO server accepts `driver:location` without authenticating the socket.
For a production deployment, add Socket.IO JWT authentication and verify that the
trip belongs to the authenticated driver before accepting GPS updates.
