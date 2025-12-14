@echo off
echo Starting Backend...
cd backend
python -m pip install -r requirements.txt
python api_server.py
