# Start Backend and Frontend in separate windows
Start-Process -FilePath "backend\start_backend.bat" -WindowStyle Normal
Write-Host "Backend starting..."

# Start Frontend
Write-Host "Starting Frontend..."
cd frontend
npm install
npm run dev
