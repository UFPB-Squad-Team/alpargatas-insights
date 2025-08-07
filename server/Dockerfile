FROM node:18-alpine AS builder

RUN npm install -g npm@latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

RUN npm install -g npm@latest

WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "npm", "start" ]
