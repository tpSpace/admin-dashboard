# Build stage
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy all files
COPY . .

# Build the Next.js app
RUN bun run build

# Production stage
FROM oven/bun:latest AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Copy necessary files from the build stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start the app
CMD ["bun", "start"]