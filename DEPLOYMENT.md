# 🚀 Deployment Guide

This guide explains how to deploy the **UNLOADIN** project for free.

## 1. Backend Deployment (Python/Flask)
We will deploy the backend to **Render** (Free Tier).

> **Note**: The Free Tier has "ephemeral" storage. Images saved locally will disappear if the server restarts. For permanent storage, you need to connect an AWS S3 Bucket (instructions below).

### Option A: Quick Demo (Ephemeral Storage)
1. Push your code to a **GitHub Repository**.
2. Go to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repo.
5. Settings:
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn api_server:app`
6. **Environment Variables**:
   - `USE_LOCAL_STORAGE`: `true`
   - `PYTHON_VERSION`: `3.9.0`
7. Click **Deploy Web Service**.
8. Copy your new Backend URL (e.g., `https://unloadin-backend.onrender.com`).

### Option B: Production (AWS S3 + DynamoDB)
*Requires AWS Account (Free Tier available).*
1. Follow steps 1-5 above.
2. **Environment Variables**:
   - `USE_LOCAL_STORAGE`: `false`
   - `AWS_ACCESS_KEY_ID`: *(Your AWS Key)*
   - `AWS_SECRET_ACCESS_KEY`: *(Your AWS Secret)*
   - `AWS_DEFAULT_REGION`: `us-east-1`
   - `BUCKET_NAME`: *(Name of your S3 Bucket)*
   - `TABLE_NAME`: *(Name of your DynamoDB Table)*
3. Ensure your IAM User has permissions for S3 and DynamoDB.

---

## 2. Frontend Deployment (Netlify)
We will deploy the frontend to **Netlify** (Free).

1. Go to [Netlify Dashboard](https://app.netlify.com/).
2. Click **Add new site** -> **Import an existing project**.
3. Select **GitHub** and authorize.
4. Pick your repository.
5. **Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. **Environment Variables** (Click "Show advanced"):
   - Key: `VITE_API_URL`
   - Value: *(Paste your Render Backend URL here, e.g., https://unloadin-backend.onrender.com)*
     > **Important**: Do not add a trailing slash `/`.
7. Click **Deploy site**.

> **Note**: A `_redirects` file has been added to `frontend/public` to ensure routing works correctly on refresh (SPA support).

---

## 3. Post-Deployment Check
1. Open your Netlify App URL.
2. Try uploading an image.
   - If using **Option A (Render Local)**: The image works but vanishes if the server sleeps (after 15 mins of inactivity).
   - If using **Option B (AWS)**: The image is permanently stored in S3.
