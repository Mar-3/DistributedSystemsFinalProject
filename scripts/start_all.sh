#! /bin/bash

# Start all services

current_dir=$(basename "$PWD")

if [ $current_dir != "scripts" ]; then
    echo "Please run this script from the scripts directory, exiting..."
    exit 1

else 
    # start database
    (cd ./db/ && docker compose up -d)
    # TODO: start backend
    # start auth
    (cd ../backend/auth &&
    docker build -t auth . &&
    docker run -d -p 8000:8000 auth)

    # start frontend
    (cd ../frontend/ && 
    docker build -t frontend . &&
    docker run -d -p 3000:3000 frontend)

    echo "All services started"
    exit 0
fi
