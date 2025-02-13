FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Create .env file from build args
ARG VITE_AI_ASSISTANT_ID
ARG VITE_AI_ASSISTANT_CALL
ARG VITE_OPENAI_API_KEY
ARG VITE_WHISPER_TRANSCRIPTION_URL
ARG VITE_BASE_URL
ARG VITE_SOCKET_URL
ARG VITE_GOOGLE_URL
ARG VITE_ENCRYPTION_KEY
ARG VITE_ENCRYPTION_IV
ARG VITE_KEK_SECRET
ARG VITE_AZURE_TRANSLATOR_KEY
ARG VITE_TRANSLATOR_ENDPOINT

# Create .env file with all variables
RUN echo "VITE_AI_ASSISTANT_ID=$VITE_AI_ASSISTANT_ID" > .env && \
    echo "VITE_AI_ASSISTANT_CALL=$VITE_AI_ASSISTANT_CALL" >> .env && \
    echo "VITE_OPENAI_API_KEY=$VITE_OPENAI_API_KEY" >> .env && \
    echo "VITE_WHISPER_TRANSCRIPTION_URL=$VITE_WHISPER_TRANSCRIPTION_URL" >> .env && \
    echo "VITE_BASE_URL=$VITE_BASE_URL" >> .env && \
    echo "VITE_SOCKET_URL=$VITE_SOCKET_URL" >> .env && \
    echo "VITE_GOOGLE_URL=$VITE_GOOGLE_URL" >> .env && \
    echo "VITE_ENCRYPTION_KEY=$VITE_ENCRYPTION_KEY" >> .env && \
    echo "VITE_ENCRYPTION_IV=$VITE_ENCRYPTION_IV" >> .env && \
    echo "VITE_KEK_SECRET=$VITE_KEK_SECRET" >> .env && \
    echo "VITE_AZURE_TRANSLATOR_KEY=$VITE_AZURE_TRANSLATOR_KEY" >> .env && \
    echo "VITE_TRANSLATOR_ENDPOINT=$VITE_TRANSLATOR_ENDPOINT" >> .env

# Build the project
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage - changed from dist to build
COPY --from=builder /app/build /usr/share/nginx/html

# Add nginx configuration
RUN echo 'server { \
    listen 5173; \
    root /usr/share/nginx/html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /assets { \
        try_files $uri =404; \
    } \
    # Add WebSocket support for Socket.IO
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

CMD ["nginx", "-g", "daemon off;"]