# Define the base image. Node 14 is the current Long Term Support (LTS) version
FROM node:14

# Set the working directory in the Docker container
WORKDIR /usr/src/server

# Copy package.json and package-lock.json (if available) into the root directory in the container
COPY package*.json ./

# Install dependencies in the Docker container
RUN npm install

# Copy the rest of the application into the Docker container
COPY . .

# Expose port 8080 (or whatever port your app runs on) to the Docker host, so we can access it
EXPOSE 8080

# Define the command that should be executed when the Docker image is run
CMD [ "node", "-r", "dotenv/config", "server.js" ]
