# Project Requirements & Prerequisites

This document details the system requirements, dependencies, and configuration setup required to run and test the College Event Management System.

## System Prerequisites
- **Node.js**: Version 18.x or higher (LTS recommended)
- **NPM**: Version 9.x or higher
- **MongoDB**: A running MongoDB database instance (local or Atlas cluster)

---

## Workspace Setup

We manage the frontend and backend using **NPM Workspaces** from the root directory.

### Quick Start: Install All Dependencies
To install dependencies for both frontend and backend concurrently, run from the root:
```bash
npm install
```

### Script Execution
- **Run both Backend & Frontend in Development Mode**:
  ```bash
  npm run dev
  ```
- **Build Frontend Assets**:
  ```bash
  npm run build:frontend
  ```
- **Run Backend Tests**:
  ```bash
  npm run test:backend
  ```

---

## Environment Variables

You must set up `.env` files in both directories before running the application.

### Backend Configurations (`backend/.env`)
Create a file named `.env` inside the `backend/` directory with the following variables:

| Variable Name | Description | Example / Default Value |
| :--- | :--- | :--- |
| `PORT` | The port the backend server listens on | `5000` |
| `MONGO_URI` | The connection URI to MongoDB database | `mongodb://localhost:27017/event_management` |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens | *[Secure Random String]* |
| `FRONTEND_URL` | Allowed origin for CORS validation requests | `http://localhost:5173` |
| `SMTP_HOST` | Host address of SMTP server for OTP emails | `smtp.ethereal.email` |
| `SMTP_PORT` | Port of SMTP server for OTP emails | `587` |
| `SMTP_USER` | Authorized username on SMTP server | *[Your SMTP Username]* |
| `SMTP_PASS` | Authorized password on SMTP server | *[Your SMTP Password]* |
| `SMTP_FROM_NAME` | Email sender name | `College Event Management` |
| `SMTP_FROM_EMAIL` | Email sender address | `noreply@collegeevents.com` |

### Frontend Configurations (`frontend/.env`)
Create a file named `.env` inside the `frontend/` directory with the following variables:

| Variable Name | Description | Example / Default Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base API URL pointing to backend endpoints | `http://localhost:5000/api` |

---

## Dependency Profiles

### Backend Packages (`backend/package.json`)
- **Core Framework**: `express`
- **Database client**: `mongoose`
- **Security & Utilities**:
  - `bcryptjs`: Password hashing & verification
  - `jsonwebtoken`: Authentication session handling
  - `cors`: Cross-Origin Resource Sharing middleware
  - `helmet`: Express security HTTP headers
  - `express-rate-limit`: Prevents timing and brute force rate limits
  - `nodemailer`: OTP email dispatch utility
- **Development**:
  - `jest`: Test framework
  - `supertest`: Endpoint test agent
  - `nodemon`: Hot-reloading server utility

### Frontend Packages (`frontend/package.json`)
- **Core Libraries**: `react`, `react-dom`
- **Routing**: `react-router-dom`
- **Build / Dev Tools**: `vite`, `@vitejs/plugin-react`

---

## Deployment Guides

### Frontend Deployment (Vercel)
Vercel is optimized for frontend hosting. Follow these steps:

1. **Deploy Repository**:
   - Link your GitHub repository to Vercel.
   - Choose `frontend` as the **Root Directory** of your Vercel project.
   - Select **Vite** as the framework preset (Vercel will auto-configure build commands: `npm run build` and output directory: `dist`).

2. **Environment Configuration**:
   - Add the following environment variable to the Vercel dashboard:
     - `VITE_API_URL`: Set this to your deployed backend URL on Render (e.g. `https://college-event-backend.onrender.com/api`).

3. **Routing Rewrites**:
   - The project includes a `frontend/vercel.json` rewrite file to ensure that client-side SPA routes (such as `/login` or `/dashboard`) resolve correctly on page refresh.

---

### Backend Deployment (Render)
Render is configured to host Node.js applications. Follow these steps:

1. **Deploy Repository**:
   - Create a new **Web Service** on Render and link your GitHub repository.
   - Set the **Root Directory** to `backend`.
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Alternatively, you can use the **Render Blueprint** (`render.yaml`) to automatically provision this service.

2. **Environment Configuration**:
   - Add the following environment variables to your Render Web Service dashboard:
     - `NODE_ENV`: `production`
     - `PORT`: `5000`
     - `MONGO_URI`: *[Your MongoDB connection URI]*
     - `JWT_SECRET`: *[Generate a strong secret key]*
     - `FRONTEND_URL`: *[Your deployed Vercel frontend URL]* (e.g. `https://college-event-frontend.vercel.app`)
     - Configure optional SMTP variables for email support if needed (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, etc.).

