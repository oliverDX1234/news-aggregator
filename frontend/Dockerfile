# Use Node.js 20 LTS as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application files
COPY . .

# Expose the port Vite uses
EXPOSE 5173

# Command to start the development server
CMD ["yarn", "dev", "--host"]
