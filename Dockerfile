# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json .
COPY bun.lockb .

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# RUN DB Migrations and build
RUN bun run db:migrateb && bun run build

# Production stage
FROM debian:bookworm-slim

WORKDIR /app

# Copy only the compiled binary from builder
COPY --from=builder /app/server .

# Expose the port your app runs on
EXPOSE 3000

# Run the binary
CMD ["./server"]
