FROM node:20-alpine

RUN apk add --no-cache openssl netcat-openbsd

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]
