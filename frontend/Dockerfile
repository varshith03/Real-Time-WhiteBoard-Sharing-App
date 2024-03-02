# Base Image
FROM node:alpine AS build-stage

# Work directory
WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./
RUN npm install

# Build frontend
COPY frontend ./
RUN npm run build

# Production stage
FROM nginx:alpine 
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
