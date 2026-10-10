
FROM node:latest AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build_docker


FROM node:latest AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /usr/src/app/src/generated/prisma ./src/generated/prisma
COPY --from=builder /usr/src/app/dist ./dist

COPY ./views ./views
COPY ./public ./public

COPY ./prisma ./prisma
COPY ./prisma7.config.ts ./prisma7.config.ts

RUN mkdir -p /usr/src/app/data \
    && chown -R node:node /usr/src/app

USER node

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]