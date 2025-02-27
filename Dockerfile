# Use Node.js for building the Vite app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files after .env has been created
COPY . .

# Ensure Vite loads .env
# RUN node -e "console.log(require('fs').readFileSync('.env', 'utf8'))"

# Build the Vite app
RUN npm run build

# Serve with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy built assets
COPY --from=builder /app/build .

# Add custom Nginx config
RUN echo 'server { \
    listen 5173; \
    root /usr/share/nginx/html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /assets { \
        try_files $uri =404; \
    } \
    location /socket.io/ { \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header Host $host; \
        proxy_pass https://talckatoo-250985c83f7c.herokuapp.com; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
