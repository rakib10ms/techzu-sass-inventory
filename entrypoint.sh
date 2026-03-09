#!/bin/sh

echo "Running database migrations..."
npx prisma migrate dev --name init

echo "Seeding database..."
npx prisma db seed

echo "Starting the application..."
npm run dev