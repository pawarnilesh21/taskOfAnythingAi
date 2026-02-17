# Task Manager - Backend Developer Intern Assignment

A REST API with JWT authentication and role-based access control, built with the MERN stack. Includes a simple React frontend to interact with the APIs.

---

## Tech Stack

- **Backend** - Node.js, Express.js
- **Database** - MongoDB with Mongoose
- **Authentication** - JWT (JSON Web Token) + bcryptjs
- **Frontend** - React.js (Vite) with Tailwind CSS
- **Validation** - express-validator
- **Environment** - dotenv, cors

---

## Project Structure

```
backend-intern-task/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js             # User schema
│   │   │   └── Task.js             # Task schema
│   │   ├── middleware/
│   │   │   └── auth.js             # JWT verify + role check
│   │   ├── routes/
│   │   │   ├── auth.js             # Register and Login routes
│   │   │   ├── tasks.js            # Task CRUD routes
│   │   │   └── admin.js            # Admin only routes
│   │   └── server.js               # Entry point
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js              # Axios instance with token
│   │   ├── App.jsx
│   │   ├── Auth.jsx                # Login and Register
│   │   ├── Dashboard.jsx           # Protected task page
│   │   ├── AdminPanel.jsx          # Admin view
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## API Endpoints

### Auth Routes - `/api/v1/auth`

| Method | Endpoint  | Description       | Access |
| ------ | --------- | ----------------- | ------ |
| POST   | /register | Register new user | Public |
| POST   | /login    | Login, get token  | Public |

### Task Routes - `/api/v1/tasks`

| Method | Endpoint | Description        | Access     |
| ------ | -------- | ------------------ | ---------- |
| GET    | /        | Get my tasks       | User/Admin |
| POST   | /        | Create a task      | User/Admin |
| PUT    | /:id     | Update task status | User/Admin |
| DELETE | /:id     | Delete a task      | Admin only |

### Admin Routes - `/api/v1/admin`

| Method | Endpoint | Description   | Access     |
| ------ | -------- | ------------- | ---------- |
| GET    | /users   | Get all users | Admin only |
| GET    | /tasks   | Get all tasks | Admin only |

---

## Database Schema

### User

```
name       - String, required
email      - String, required, unique
password   - String, required, hashed with bcrypt
role       - String, enum: ['user', 'admin'], default: 'user'
createdAt  - Date
```

### Task

```
title        - String, required
description  - String, optional
status       - String, enum: ['pending', 'completed'], default: 'pending'
userId       - ObjectId, ref: User
createdAt    - Date
```

---

## Local Setup

### Requirements

- Node.js v18 or above
- MongoDB running locally or MongoDB Atlas account

### Step 1 - Clone the repository

```bash
git clone https://github.com/yourusername/backend-intern-task.git
cd backend-intern-task
```

### Step 2 - Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/backend-intern-task
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Step 3 - Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```
VITE_API_URL=http://localhost:5000/api/v1
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## How to Create an Admin User

The register form on the frontend creates users with the `user` role by default. To create an admin, use Postman:

```
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "123456",
  "role": "admin"
}
```

Login with this account on the frontend. You will see the Admin Panel button in the header.

---

## Security Practices

- Passwords are hashed using bcrypt with 10 salt rounds before saving to the database
- JWT tokens are signed with a secret key stored in environment variables
- Token is verified on every protected route using middleware
- Role check middleware (`isAdmin`) blocks non-admin users from admin routes
- Input validation is done on all routes using express-validator
- CORS is configured to allow requests only from the frontend URL
- Sensitive keys like JWT secret and DB URI are stored in `.env` and never committed to Git

---

## API Documentation

Import the Postman collection to test all endpoints.

**Base URL** - `http://localhost:5000/api/v1`

**Authorization** - Add `Bearer <token>` in the Authorization header for protected routes.

Sample request bodies are listed below.

Register:

```json
{ "name": "John", "email": "john@test.com", "password": "123456" }
```

Login:

```json
{ "email": "john@test.com", "password": "123456" }
```

Create Task:

```json
{ "title": "My first task", "description": "Optional description" }
```

Update Task:

```json
{ "status": "completed" }
```

---

## Deployment

### Backend - Render or Railway

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Set build command to `npm install`
4. Set start command to `node src/server.js`
5. Add environment variables from your `.env` file in the Render dashboard
6. Use MongoDB Atlas connection string for `MONGODB_URI`

### Frontend - Vercel or Netlify

1. Push your frontend folder to GitHub
2. Import the repo on Vercel
3. Set `VITE_API_URL` to your deployed backend URL in the environment variables
4. Deploy

### MongoDB - MongoDB Atlas

1. Create a free cluster on MongoDB Atlas
2. Add a database user with read/write access
3. Whitelist all IPs (0.0.0.0/0) for deployment
4. Copy the connection string and use it as `MONGODB_URI`

---

## Scalability Notes

These are architectural decisions that can be made as the project grows:

- **Database Indexing** - Add indexes on `email` in User and `userId` in Task for faster queries as data grows
- **Rate Limiting** - Use `express-rate-limit` to prevent API abuse and brute force attacks on the login route
- **Caching** - Frequently accessed data like task lists can be cached using Redis to reduce database load
- **Microservices** - Auth service and Task service can be separated into independent services with their own databases
- **Load Balancing** - When traffic increases, multiple instances of the backend can run behind an Nginx load balancer
- **Logging** - Add Morgan for HTTP request logs and Winston for application-level logs in production

---

## What the Frontend Does

- Register and Login with form validation and error messages
- JWT token is stored in localStorage after login
- Token is automatically attached to every API request via Axios interceptor
- Dashboard shows all tasks for the logged-in user
- Tasks can be created, marked complete, and reopened
- Admin users see a Delete button on each task and an Admin Panel button in the header
- Admin Panel shows all users and all tasks across the system
- Logout clears the token and redirects to login

---

## Author

Your Name  
GitHub: github.com/pawarnilesh21
Email: pawarnil898@gmail.com
