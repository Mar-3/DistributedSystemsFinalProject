#! /bin/bash

# Start all services

current_dir=$(basename "$PWD")

if [ $current_dir != "scripts" ]; then
    echo "Please run this script from the scripts directory, exiting..."
    exit 1

else 
    # start database
    (cd ./db/ && docker compose up -d)
    
    # start auth
    (cd ../backend/auth &&
    docker build -t auth . &&
    docker run -d --net custom --ip 10.5.0.2 -p 8001:8001 auth)

    # start main backend
    (cd ../backend &&
    docker build -t backend . &&
    docker run -d --net custom --ip 10.5.0.3 -p 8000:8000 backend)

    # start frontend
    (cd ../frontend/ && 
    docker build -t frontend . &&
    docker run -d --net custom --ip 10.5.0.4 -p 3000:3000 frontend)

    echo "All services started"
    exit 0
fi
