# Build & Dependency Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production Runtime Stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy node_modules and source code from builder
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Use non-root user for security hardening
USER node

EXPOSE 5000

CMD ["node", "src/server.js"]
