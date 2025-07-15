# Dockerfile

FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything else
COPY . .

# Generate Prisma Client for the Docker platform
RUN npx prisma generate

# Build the TypeScript code
RUN npm run build

# Expose API port
EXPOSE 4000

# Run app in production
CMD ["node", "dist/server.js"]
