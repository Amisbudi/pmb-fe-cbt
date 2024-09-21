# Step 1: Build the React Vite app
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the app (this will generate the "dist" folder)
RUN npm run build

# Step 2: Set up NGINX to serve the built files
FROM nginx:alpine

# Copy the built app from the previous step
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom NGINX config if needed
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port on which NGINX will serve the app
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
