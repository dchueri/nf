FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the development server
CMD ["yarn", "dev"]
