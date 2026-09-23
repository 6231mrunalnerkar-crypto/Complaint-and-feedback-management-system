# CampusVoice Backend

Node.js + Express + MongoDB API for the Complaint and Feedback Management System.

## Setup

1. Open a terminal in `server`.
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env`.
4. Set a real MongoDB URI and a long JWT secret.
5. Start MongoDB (local MongoDB service or MongoDB Atlas).
6. Create the initial admin/staff accounts:

```bash
npm run seed
```

7. Start the API:

```bash
npm run dev
```

API:
- Health: `GET http://localhost:5000/api/health`
- Auth: `/api/auth`
- Complaints: `/api/complaints`
- Feedback: `/api/feedback`
- Users: `/api/users`

## Main API flow

### Student registration
`POST /api/auth/register`

For the current registration form, send `multipart/form-data` with:
- firstName
- lastName
- institution
- dateOfBirth
- address
- rollNumber
- contact
- email
- password
- consent=true
- identityProof (optional JPG/PNG/PDF)

### Login
`POST /api/auth/login`

Student:
```json
{
  "email": "student@campus.edu",
  "password": "password",
  "role": "student"
}
```

Staff/Admin:
```json
{
  "email": "staff@campus.edu",
  "loginCode": "your-code",
  "role": "staff"
}
```

### Guest complaint
`POST /api/complaints`

```json
{
  "title": "Wi-Fi problem",
  "description": "No internet in Hostel B.",
  "category": "Hostel",
  "priority": "High",
  "anonymous": true
}
```

### Student complaint
Send the JWT in:
`Authorization: Bearer <token>`

`POST /api/complaints`

```json
{
  "title": "Library issue",
  "description": "AC is not working.",
  "category": "Library",
  "priority": "Medium",
  "anonymous": false
}
```

### Admin
- `GET /api/complaints`
- `PATCH /api/complaints/:id/assign`
- `PATCH /api/complaints/:id/priority`
- `PATCH /api/complaints/:id/status`
- `GET /api/complaints/staff`
- `GET /api/complaints/stats`
- `GET /api/feedback`
- `GET /api/users`
- `POST /api/users/staff`

### Staff
- `GET /api/complaints`
- `GET /api/complaints/:id`
- `PATCH /api/complaints/:id/status`
- `POST /api/complaints/:id/updates`
- `POST /api/complaints/:id/resolve`
- `GET /api/complaints/stats`

Staff only receives complaints assigned to that staff member.

### Public tracking
`GET /api/complaints/track/:referenceId`

### Feedback
- `GET /api/feedback/verify/:referenceId`
- `POST /api/feedback`
- Admin: `GET /api/feedback`

Feedback is accepted only when a complaint is `Resolved` or `Closed`, and only one feedback entry is allowed per complaint.

## Security

- Passwords/login codes are bcrypt-hashed.
- JWT authentication is required for protected APIs.
- Admin/staff/student role authorization is enforced on the server.
- Identity-proof uploads are limited to JPG/PNG/PDF and 5 MB.
- Do not commit `.env` or uploaded identity documents to Git.
