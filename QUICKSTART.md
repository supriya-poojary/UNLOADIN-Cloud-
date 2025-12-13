# Quick Start Guide - Backend Setup

## The Issue
The backend API server needs to be running for image uploads to work. Follow these steps:

## Step 1: Stop Current Docker Services

```bash
cd c:\Users\supri\Downloads\UNLOADIN
docker-compose down
```

## Step 2: Start Services with New Configuration

```bash
docker-compose up -d
```

Wait 15-20 seconds for services to start, then:

```bash
# Initialize LocalStack resources
bash scripts/init_localstack.sh
```

## Step 3: Verify Backend is Running

Check if the API server is responding:

```bash
curl http://localhost:8000/health
```

You should see: `{"status":"healthy"}`

## Step 4: Restart Frontend

The frontend needs to reload to pick up the new API URL (http://localhost:8000):

```bash
# Stop the current npm run dev (Ctrl+C in the terminal)
# Then restart:
cd frontend
npm run dev
```

## Step 5: Test Upload

1. Go to http://localhost:5173
2. Click "Get Started" or "Sign In"
3. Click "Login" (credentials don't matter for demo)
4. Try uploading an image

## Troubleshooting

### If upload still fails:

1. **Check backend logs**:
   ```bash
   docker-compose logs backend
   ```

2. **Check if backend is accessible**:
   ```bash
   curl http://localhost:8000/health
   ```

3. **Verify LocalStack is running**:
   ```bash
   docker-compose ps
   ```

4. **Check browser console** (F12) for error messages

### Common Issues:

- **Port 8000 already in use**: Stop other services using port 8000
- **Docker not running**: Start Docker Desktop
- **LocalStack not ready**: Wait 30 seconds after `docker-compose up`

## About "Forgot Password"

The "Forgot Password" link is currently a UI element only. To implement actual password reset functionality, you would need to:

1. Add an authentication service (AWS Cognito, Auth0, or custom)
2. Implement email sending (AWS SES)
3. Create password reset flow with tokens

For this demo, authentication is simulated - clicking "Login" takes you directly to the dashboard.

---

**Need Help?** Contact: supriyaspoojary26@gmail.com
