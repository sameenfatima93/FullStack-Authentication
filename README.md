# AuthSphere v2 — Single App Auth System

One frontend app for both Users and Admins!

## 🗂️ Structure

```
auth-system-v2/
├── server/          ← Backend (Node.js + Express + MongoDB)
└── client/          ← ONE React app for everyone
```

## 🚀 Setup

### Terminal 1 — Backend
```bash
cd server
npm install
npm run dev
```

### Terminal 2 — Frontend
```bash
cd client
npm install
npm run dev
```

Open: http://localhost:5173

## 🔄 How Role Routing Works

```
Signup Page
  ○ User  ← choose this → after signup → /dashboard
  ○ Admin ← choose this → after signup → /admin/dashboard

Login Page (same for everyone)
  → Backend detects role automatically
  → User  → /dashboard
  → Admin → /admin/dashboard
```

## ⚙️ .env Setup (server/.env)

```env
PORT=8000
MONGO_URI=your_mongodb_atlas_uri/auth-system
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_USER_URL=http://localhost:5173
CLIENT_ADMIN_URL=http://localhost:5173
```
