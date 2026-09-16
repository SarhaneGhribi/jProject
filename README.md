# Ghribi Foundation

A full-stack donation platform: browse foundations, create an account, and donate to the causes you care about. Built with React (Create React App) on the frontend and Express + MySQL on the backend.

## Features

- Browse foundations with a live funds/goal progress bar and search by name
- Email + password signup with OTP email verification, or sign in with Google
- JWT-based sessions, forgot/reset password flow
- Donating requires being signed in; donations are linked to your account
- "My donations" page with your full donation history and total given

## Tech stack

- **Frontend:** React 18 (Create React App), React Router, Axios
- **Backend:** Node.js, Express, MySQL (`mysql2`)
- **Auth:** JWT, bcrypt, Google Identity Services (ID token verified server-side with `google-auth-library`)
- **Email:** Nodemailer (OTP codes and password-reset links; falls back to logging to the console if SMTP isn't configured, so the app still runs without a mail provider in dev)

## Project structure

```
backend/              Express API (port 5000)
  auth/                authentication (signup, OTP, login, Google, password reset)
  donations/           donation creation + history
  foundations/         foundation CRUD
  doners/              legacy, unused by the current frontend
  db.js                shared MySQL connection
src/                   React app (port 3000)
  api/                 axios wrappers for the backend
  components/          UI components (auth forms, foundation cards, search)
  context/AuthContext  session state
  pages/                routed pages (Home, My Donations)
schema.sql             MySQL schema
```

## Prerequisites

- Node.js and npm
- A running MySQL server

## Setup

1. **Install dependencies** (frontend and backend have separate `package.json`s):
   ```
   npm install
   cd backend && npm install && cd ..
   ```

2. **Create the database** and load the schema:
   ```
   mysql -u root -p < schema.sql
   ```
   This creates a `myfoundation` schema with the `foundations`, `doners`, `users`, `otp_codes`, `password_resets`, and `donations` tables.

3. **Configure environment variables** — copy each example file and fill in your own values:
   ```
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

   **`backend/.env`**

   | Variable | Purpose |
   | --- | --- |
   | `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection |
   | `JWT_SECRET`, `JWT_EXPIRES_IN` | signs login sessions |
   | `GOOGLE_CLIENT_ID` | Google OAuth client ID (see below) |
   | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | outgoing email; leave blank in dev to just log emails to the console |
   | `OTP_EXPIRY_MINUTES`, `PASSWORD_RESET_EXPIRY_MINUTES` | token lifetimes |
   | `FRONTEND_URL` | used to build the link in password-reset emails |

   **`.env`** (frontend)

   | Variable | Purpose |
   | --- | --- |
   | `REACT_APP_API_URL` | backend base URL |
   | `REACT_APP_GOOGLE_CLIENT_ID` | must match `GOOGLE_CLIENT_ID` above |

   To enable **Google sign-in**: create an OAuth client ID in [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (type "Web application", with `http://localhost:3000` as an authorized JavaScript origin), and put the same client ID in both `.env` files. Without it, the Google button just shows as unavailable.

4. **Run it** (two terminals):
   ```
   cd backend && npm start   # API on http://localhost:5000
   npm start                 # app on http://localhost:3000
   ```

## Available scripts

**Frontend** (repo root): `npm start`, `npm run build`, `npm test`

**Backend** (`backend/`): `npm start` (runs the API with nodemon, auto-restarting on changes)
