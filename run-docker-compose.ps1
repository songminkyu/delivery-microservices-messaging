# Windows PowerShell script to run Docker Compose
# This script executes the Docker Compose command to build and start services

Write-Host "Starting Docker Compose with image test configuration..."
docker compose -f ./docker-compose.image-test.yml up --build

Write-Host "Docker Compose execution completed."
