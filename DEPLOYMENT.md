Frontend / Backend Deployment Quick Guide

Overview
--------
This project ships a Vite-based React frontend and an Express-based Node.js backend API.
In development, Vite uses a proxy to forward `/api/*` to the backend running at `http://localhost:5000`.
In production, you must set environment variables correctly so the frontend can find the API and the backend allows CORS.

Frontend (Vite)
---------------
- Build command: `npm run build` (when in `frontend/`).
- Environment variable (Vite):
  - `VITE_API_BASE_URL` — the *backend root* URL without a trailing `/api`. Example: `https://api.example.com`
  - If `VITE_API_BASE_URL` is not set, the frontend will use the same origin + `/api` (e.g. calling `/api/*`).
- If you host frontend and backend on the same domain and want API to be proxied by the same origin, you can leave `VITE_API_BASE_URL` unset and ensure your reverse proxy forwards `/api` to the backend.

Backend (Express)
------------------
- Run command: `node server.js` (or `npm start`) from `backend/`.
- Required environment variables (example `.env`):
  - `PORT` — server port (default 5000)
  - `MONGO_URI` — your MongoDB connection string
  - `JWT_SECRET` — secret for JWT tokens
  - `FRONTEND_URL` or `FRONTEND_URLS` — domain(s) allowed via CORS. For multiple origins, provide comma-separated values. Example: `FRONTEND_URLS=https://app.example.com,https://preview.example.com`
  - `ALLOW_ALL_ORIGINS` — set to `true` only for debugging; not recommended in production
  - `CLIENT_BUILD_PATH` (optional) — path to frontend build directory to serve static files when backend hosts client (default `../frontend/dist`)
- CORS: Make sure `FRONTEND_URL` or `FRONTEND_URLS` includes the exact origin of your deployed frontend for the browser to allow cross-origin requests.

Typical Deployment Options
---------------------------
1. Serve Frontend and Backend from the same domain (recommended):
   - Build the frontend: `cd frontend && npm install && npm run build`
   - Copy `dist` content to the server host (or set `CLIENT_BUILD_PATH`) and set environment variable `NODE_ENV=production`.
   - Start backend. The app will serve static files and act as API on `/api/*`.

2. Host Frontend and Backend separately:
   - Deploy frontend to static host (Netlify, Vercel, S3+CloudFront)
   - Deploy backend as an API service (Heroku, Azure, AWS ECS, etc.)
   - In this setup, set `VITE_API_BASE_URL` to the backend URL and set `FRONTEND_URL` in the backend to your frontend origin.

Known Deployment Pitfalls
--------------------------
- Mixed content errors: If your frontend is served over HTTPS, the API must be HTTPS.
- A missing `FRONTEND_URL(S)` on the backend leads to CORS blocking requests in production.
- If you accidentally set `VITE_API_BASE_URL` to include `/api` (e.g., `https://api.example.com/api`), some requests may end up hitting `https://api.example.com/api/api` (double path). Set `VITE_API_BASE_URL` to `https://api.example.com` (no `/api`).
- If you host the frontend separately, ensure `VITE_API_BASE_URL` is set and backend CORS allows frontend origin.

Debugging Steps
---------------
- Check the browser console for CORS errors — note the blocked origin and add it to `FRONTEND_URLS`.
- Verify `VITE_API_BASE_URL` in production build logs or the deployed environment variables.
- Make sure API routes are accessible using `curl` or `Postman` directly from your cloud environment.

Example `.env` values
---------------------
# Backend (.env)
PORT=5000
MONGO_URI=your_connection_string
JWT_SECRET=very-long-secret
FRONTEND_URLS=https://app.example.com
ALLOW_ALL_ORIGINS=false
CLIENT_BUILD_PATH=/var/www/app/frontend/dist

# Frontend (set in your host service environment variables, example for Vite build)
VITE_API_BASE_URL=https://api.example.com

