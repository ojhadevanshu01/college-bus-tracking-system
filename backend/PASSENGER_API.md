# Passenger Authentication API

## Register

`POST /api/auth/passenger/register`

```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "phone": "9876543210",
  "studentId": "CS2026001",
  "college": "ABC College",
  "password": "StrongPass123"
}
```

## Login

`POST /api/auth/passenger/login`

```json
{
  "email": "aarav@example.com",
  "password": "StrongPass123"
}
```

The response contains a JWT and a `passenger` object. Store the token as a Bearer token for protected requests.

## Current profile

`GET /api/auth/passenger/me`

Header:

`Authorization: Bearer <JWT>`

## Frontend routes

- `/passenger/login`
- `/passenger/register`
- `/passenger`
