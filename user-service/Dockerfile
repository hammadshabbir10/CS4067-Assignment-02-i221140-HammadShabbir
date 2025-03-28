# Use a minimal Node.js base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for efficient caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 5000

# Define environment variables (override in docker-compose)
ENV PORT=5000
ENV DATABASE_URL=postgres://postgres:mostwanted3z@db:5432/userdb

# Start the application
CMD ["node", "server.js"]
