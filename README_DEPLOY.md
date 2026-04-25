# Vercel Deployment Guide for TrustMeds

This project has been structured as a monorepo to allow seamless deployment of both the Frontend (Vite) and Backend (Express) to Vercel as a single project.

## Steps to Deploy

1. **Push to GitHub/GitLab/Bitbucket**:
   Ensure all changes are pushed to your remote repository.

2. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard).
   - Click **Add New > Project**.
   - Import your **TrustMeds** repository.

3. **Configure Environment Variables**:
   In the Vercel project settings, add the following Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string (e.g., MongoDB Atlas).
   - `JWT_SECRET`: A secure random string for JWT signing.
   - `NODE_ENV`: Set to `production`.

4. **Deploy**:
   Vercel will detect the `vercel.json` in the root and automatically:
   - Build the frontend (Vite) and serve it as a SPA.
   - Deploy the backend (Express) as a serverless function.
   - Route all `/api/*` requests to the backend.

## Project Structure Adjustments

- **Root `package.json`**: Added to manage the monorepo with npm workspaces.
- **Root `vercel.json`**: Configures the unified build and routing strategy.
- **Backend `server.js`**: Modified to export the app and skip `app.listen()` in production (Vercel handles this).
- **Frontend `api.js`**: Updated to use a relative path `/api` by default, ensuring it works both locally and on Vercel without manual URL changes.

## Local Development

You can still run the projects separately:
- **Root**: `npm run frontend:dev` or `npm run backend:dev`
- **Frontend**: `cd frontend && npm run dev`
- **Backend**: `cd backend && npm run dev`
