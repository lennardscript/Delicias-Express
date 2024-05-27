#!/bin/bash

# Load environment variables from .env
export $(egrep -v '^#' .env | xargs)

# Build Backend Docker image
docker build \
  --build-arg POSTGRES_USER=$POSTGRES_USER \
  --build-arg POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  --build-arg POSTGRES_DB=$POSTGRES_DB \
  --build-arg POSTGRES_HOST=$POSTGRES_HOST \
  --build-arg POSTGRES_PORT=$POSTGRES_PORT \
  -t backend .

# Build Frontend Docker image
docker build -t client ./Client
  
# Run Backend Docker container
docker run -d -p 8080:8080 -p 8081:8081 backend

# Run Frontend Docker container
docker run -d -p 5000:5000 -p 5001:5001 client