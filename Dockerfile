
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install --ignore-scripts


RUN npx prisma generate --schema=./prisma/schema/

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]