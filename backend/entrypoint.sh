#!/bin/bash

set -e

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
