#!/bin/bash

echo "Installing requirements..."
pip install -r backend/requirements.txt

echo "Running Unit Tests (Moto)..."
# We need to set python path so src module is found
export PYTHONPATH=$PYTHONPATH:$(pwd)/backend

pytest backend/tests/unit -v

echo "Running Integration Tests (LocalStack)..."
# Note: LocalStack container must be running for this to work.
# Check if localstack is reachable
if curl -s http://localhost:4566 > /dev/null; then
    pytest backend/tests/integration -v
else
    echo "LocalStack not running on localhost:4566. Skipping integration tests."
    echo "Run 'docker-compose up -d' to start LocalStack."
fi
