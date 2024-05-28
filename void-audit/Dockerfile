# FROM node:21-alpine

# # Install necessary dependencies for running Puppeteer
# RUN apk add --no-cache \
#       chromium \
#       nss \
#       freetype \
#       harfbuzz \
#       ca-certificates \
#       ttf-freefont

# # Environment variables to support Puppeteer
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
#     PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# WORKDIR /app

# COPY . .

# COPY ["package.json", "package-lock.json*", "./"]

# RUN npm install

# CMD [ "npm", "run", "dev" ]



# Stage 1: Workspace
FROM node:21-alpine AS workspace
WORKDIR /app
COPY package.json package-lock.json ./
COPY . .
COPY ./prisma ./prisma

# Stage 2: Dependencies
FROM node:21-alpine AS deps
WORKDIR /app
COPY --from=workspace /app ./
RUN npm install

# Stage 3: Build
# FROM node:21-alpine AS builder
# WORKDIR /app
# COPY --from=deps /app ./
# ENV NEXT_TELEMETRY_DISABLED 1
# RUN npm run build

# Stage 4: Final Runner
FROM node:21-alpine AS runner_test
WORKDIR /app
# COPY --from=builder /app ./
COPY --from=deps /app ./

# Install Puppeteer dependencies
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
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000

CMD ["sh", "script.sh" ]
# CMD ["npm", "run", "dev"]

# FROM node:21-alpine AS workspace
# WORKDIR /app
# COPY . .
# COPY package.json package-lock.json* ./

# FROM node:21-alpine AS deps
# WORKDIR /app
# COPY --from=workspace /app ./
# RUN npm install

# FROM node:21-alpine AS builder
# WORKDIR /app
# COPY --from=deps /app ./
# # COPY . .
# ENV NEXT_TELEMETRY_DISABLED 1
# RUN npm run build

# FROM node:21-alpine AS runner_test
# WORKDIR /app
# RUN apk add --no-cache \
#       chromium \
#       nss \
#       freetype \
#       harfbuzz \
#       ca-certificates \
#       ttf-freefont

# # Environment variables to support Puppeteer
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
#     PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# ENV NEXT_TELEMETRY_DISABLED 1

# EXPOSE 3000

# CMD ["npm" , "run", "start" ]


# TODO: need to check [
# ENV NODE_ENV production>
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# --chown=nextjs:nodejs
# ]

# ENV NEXT_TELEMETRY_DISABLED 1
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/next.config.mjs ./
# COPY --from=builder /app/.next/static ./.next/static
# COPY --from=builder /app/public ./public

# Verify that all required localization files are present
# COPY --from=builder /app/node_modules/lighthouse/shared/localization/locales /app/node_modules/lighthouse/shared/localization/locales

# CMD ["node", "/app/server.js" ]
# ENTRYPOINT [ "tail", "-f" , "/dev/null" ]
