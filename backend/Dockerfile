# Base Image
FROM node:alpine

# Work directory
WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy code
COPY backend ./

# Expose port 
EXPOSE 5000 

# Start the server
CMD ["node", "server.js"] 
