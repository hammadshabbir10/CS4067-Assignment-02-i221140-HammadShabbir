# Use a minimal Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json, then install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the booking service port
EXPOSE 5002

# Start the booking service
CMD ["node", "server.js"]
