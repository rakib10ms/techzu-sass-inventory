
FROM node:20-alpine
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install --ignore-scripts


RUN npx prisma generate --schema=./prisma/schema/

COPY . .
# entrypoint.sh ফাইলটিকে এক্সিকিউটেবল পারমিশন দেওয়া
RUN chmod +x entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["sh", "./entrypoint.sh"]