# Stage 1: build the app
FROM node:20-alpine AS builder
WORKDIR /app

# copy package files first for better caching
COPY package*.json ./
# or if you use yarn: COPY yarn.lock package.json ./
RUN npm ci

# copy source and build
COPY . .
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:stable-alpine AS production
# Copy custom nginx config (optional, recommended for SPAs)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
