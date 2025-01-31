# News Aggregator - Dockerized Setup Guide

## Introduction

This repository contains a **News Aggregator** application built with **Laravel (backend)** and **React (frontend)**. The application is fully containerized using **Docker** and orchestrated with **Docker Compose**. This guide provides detailed steps to set up and run the application.

## Prerequisites

Ensure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure

```
.
├── backend/         # Laravel backend
│   ├── app/        # Application source code
│   ├── config/     # Laravel configuration files
│   ├── database/   # Migrations & seeders
│   ├── routes/     # API routes
│   ├── .env        # Environment variables (handled in container)
│   ├── entrypoint.sh  # Backend entry script
│   └── Dockerfile  # Backend Docker configuration
│
├── frontend/        # React frontend
│   ├── src/        # Frontend source code
│   ├── public/     # Static assets
│   ├── package.json
│   ├── yarn.lock
│   ├── .env        # Environment variables
│   └── Dockerfile  # Frontend Docker configuration
│
├── docker-compose.yml  # Docker Compose configuration
└── README.md           # Documentation
```

## Setting Up the Project

### 1. Clone the Repository

```sh
$ git clone <repository-url>
$ cd <project-folder>
```

### 2. Setup Environment Variables

Copy the example environment files to `.env` for both the backend and frontend:

```sh
$ cp backend/.env.example backend/.env
$ cp frontend/.env.example frontend/.env
```

### 3. Install Backend Dependencies

Before starting Docker, install Laravel's dependencies manually to ensure `vendor/` exists:

```sh
$ cd backend
$ composer install --no-dev --optimize-autoloader
$ cd ..
```

### 4. Start the Application

To start the application, run:

```sh
$ docker-compose up --build
```

This will:

- Start the **frontend** React app on `http://localhost:3000`
- Start the **backend** Laravel API on `http://localhost:8080`
- Start the **MySQL database**
- Start **Nginx** as a reverse proxy on `http://localhost:8080`
- Start a **scheduler** container for running Laravel's scheduled jobs

### 5. Backend Entry Script

The backend has an **entry script (`entrypoint.sh`)** that ensures migrations, seeders, and scraping operations run only once:
note: this creates migrations_completed, seeding_completed, scraping_completed in the /storage/logs, if you want them to run again on start, delete this files

#### `/backend/entrypoint.sh`

```bash
#!/bin/bash

set -e

# Ensure dependencies are installed
if [ ! -d "vendor" ]; then
    echo "Installing dependencies..."
    composer install --no-dev --optimize-autoloader
fi

# Ensure storage directories exist
mkdir -p storage/framework/{sessions,cache,views}
chmod -R 777 storage bootstrap/cache

# Automatically generate APP_KEY if not set
if ! grep -q "APP_KEY=base64" .env; then
    echo "Generating app key..."
    php artisan key:generate
fi

# Prevent running migrations multiple times
if [ ! -f /var/www/html/storage/app/migrations_completed ]; then
    echo "Running migrations..."
    php artisan migrate --force
    touch /var/www/html/storage/app/migrations_completed
fi

# Prevent running seeders multiple times
if [ ! -f /var/www/html/storage/app/seeding_completed ]; then
    echo "Running seeders..."
    php artisan db:seed --force
    touch /var/www/html/storage/app/seeding_completed
fi

# Prevent running the scraper multiple times
if [ ! -f /var/www/html/storage/app/scraping_completed ]; then
    echo "Running scraper..."
    php artisan scrape:articles
    touch /var/www/html/storage/app/scraping_completed
fi

echo "Starting the application..."
exec "$@"
```

### 6. Setting Up the Backend (This one is covered in the entryscript)

#### Enter the backend container:

```sh
$ docker exec -it laravel_backend bash
```

#### Generate Application Key

```sh
$ php artisan key:generate
```

#### Exit the Container

```sh
$ exit
```

### 7. Setting Up the Frontend(The dependenices are already installed)

#### Install Dependencies

Since the `node_modules` directory is not shared between the host and container, you may need to run:

```sh
$ docker exec -it react_frontend yarn install
```

#### Access the Frontend

The frontend will be running at:

```
http://localhost:3000
```

### 8. Running Artisan Commands

To run Laravel Artisan commands inside the container, use:

```sh
$ docker exec -it laravel_backend php artisan <command>
```

Example:

```sh
$ docker exec -it laravel_backend php artisan cache:clear
```

### 9. Running MySQL Queries

Access the MySQL database using:

```sh
$ docker exec -it mysql_container mysql -u user -p
```

Password: `password`

### 10. Logging in

Default database credentials are seeded:

- **Username:** `user@gmail.com`
- **Password:** `pass123`

Feel free to register and create new users.

### 11. Stopping the Containers

To stop the application without removing containers:

```sh
$ docker-compose stop
```

To remove the containers:

```sh
$ docker-compose down
```

This will **not** remove database volumes.

### 12. Removing Database Volumes (Reset Database)

If you want to **delete all database data**, run:

```sh
$ docker-compose down -v
```

## Additional Notes

- **Backend API URL:** `http://localhost:8080/api`
- **Frontend URL:** `http://localhost:3000`
- **Adminer (Optional Database Management):** You can add [Adminer](https://www.adminer.org/) if needed for database administration.
- **Scheduler:** The Laravel scheduler runs inside the `scheduler` container, executing scheduled commands.

## Troubleshooting

### 1. Check Container Logs

```sh
$ docker logs laravel_backend -f
```

### 2. Database Connection Issues

Ensure the backend `.env` file has the correct database configuration:

```
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=news_aggregator
DB_USERNAME=user
DB_PASSWORD=password
```

If the database is not initialized correctly, try:

```sh
$ docker-compose down -v && docker-compose up --build
```

### 3. Permission Issues

If you face permission issues in the Laravel backend, try setting correct permissions:

```sh
$ docker exec -it laravel_backend chmod -R 777 storage bootstrap/cache
```

---

**Enjoy your News Aggregator app! 🚀**

