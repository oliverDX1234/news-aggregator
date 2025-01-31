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

# Ensure this script only runs in the 'laravel_backend' container
if [[ "$CONTAINER_ROLE" == "laravel_backend" ]]; then
    echo "Running entry script in laravel_backend..."

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
fi

echo "Starting the application..."
exec "$@"
