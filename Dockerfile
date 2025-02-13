FROM node:18-alpine AS builder
# Create .env file using mounted secrets
RUN --mount=type=secret,id=ai_assistant_id \
    --mount=type=secret,id=ai_assistant_call \
    --mount=type=secret,id=openai_api_key \
    --mount=type=secret,id=whisper_url \
    --mount=type=secret,id=base_url \
    --mount=type=secret,id=socket_url \
    --mount=type=secret,id=google_url \
    --mount=type=secret,id=encryption_key \
    --mount=type=secret,id=encryption_iv \
    --mount=type=secret,id=kek_secret \
    --mount=type=secret,id=azure_translator_key \
    --mount=type=secret,id=translator_endpoint \
    set -e; \
    echo "VITE_AI_ASSISTANT_ID=$(cat /run/secrets/ai_assistant_id)" >> .env && \
    echo "VITE_AI_ASSISTANT_CALL=$(cat /run/secrets/ai_assistant_call)" >> .env && \
    echo "VITE_OPENAI_API_KEY=$(cat /run/secrets/openai_api_key)" >> .env && \
    echo "VITE_WHISPER_TRANSCRIPTION_URL=$(cat /run/secrets/whisper_url)" >> .env && \
    echo "VITE_BASE_URL=$(cat /run/secrets/base_url)" >> .env && \
    echo "VITE_SOCKET_URL=$(cat /run/secrets/socket_url)" >> .env && \
    echo "VITE_GOOGLE_URL=$(cat /run/secrets/google_url)" >> .env && \
    echo "VITE_ENCRYPTION_KEY=$(cat /run/secrets/encryption_key)" >> .env && \
    echo "VITE_ENCRYPTION_IV=$(cat /run/secrets/encryption_iv)" >> .env && \
    echo "VITE_KEK_SECRET=$(cat /run/secrets/kek_secret)" >> .env && \
    echo "VITE_AZURE_TRANSLATOR_KEY=$(cat /run/secrets/azure_translator_key)" >> .env && \
    echo "VITE_TRANSLATOR_ENDPOINT=$(cat /run/secrets/translator_endpoint)" >> .env

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .


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

