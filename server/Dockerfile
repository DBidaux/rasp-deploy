# Stage 1: Build
FROM node:20 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (if needed, for example with TypeScript)
# RUN npm run build

# Stage 2: Runtime
FROM node:20-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy the build output from the previous stage (if there is any)
# COPY --from=build /app/build ./build

# Copy application source code
COPY --from=build /usr/src/app .

# Install production dependencies
RUN npm install --only=production

# Expose the port the app runs on
EXPOSE 8080

# Command to start the application
CMD ["npm", "start"]
