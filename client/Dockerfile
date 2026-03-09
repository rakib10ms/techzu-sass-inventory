FROM node:20-alpine

WORKDIR /app

# Dependency install করার সময় ক্যাশ ব্যবহার করার জন্য
COPY package*.json ./

# ডকার ইমেজের ভেতরে ফ্রেশ ইন্সটল করা
RUN npm install

# এরপর সব কোড কপি করা
COPY . .

# রিঅ্যাক্ট ৫ এর জন্য এই এনভায়রনমেন্ট দরকার হতে পারে
ENV CI=true
ENV WDS_SOCKET_PORT=0

EXPOSE 3000

CMD ["npm", "start"]