FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY src/ ./src/
COPY public/ ./public/

# Expose port and start application
EXPOSE 8080
ENV PORT=8080

# Hardening for Cloud Run
ENV NODE_ENV=production

CMD [ "node", "src/server.js" ]
