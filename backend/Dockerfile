# Use PHP base image
FROM php:8.2-fpm

# Set the working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    git \
    && docker-php-ext-install pdo_mysql zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Copy and set permissions for the entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose the PHP-FPM port
EXPOSE 9000

# Set the entrypoint
ENTRYPOINT ["entrypoint.sh"]

# Default command to start PHP-FPM
CMD ["php-fpm"]
