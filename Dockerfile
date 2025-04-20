FROM node:18-alpine

WORKDIR /app

# Copy server package.json
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy server code
COPY server ./

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]