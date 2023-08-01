# Use the official Node.js image as the base image
FROM node:14 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React application
RUN npm run build

# Use a lightweight HTTP server to serve the static files
FROM nginx:alpine

# Copy the built static files from the previous stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 for the application
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]