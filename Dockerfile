FROM node:21-alpine

# Install necessary dependencies for running Puppeteer
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# Environment variables to support Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY . .

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

CMD [ "npm", "run", "dev" ]
