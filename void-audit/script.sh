#!/bin/sh

sleep 10

npx prisma generate

npx prisma migrate dev

npx prisma migrate deploy

npx prisma studio &

npm run dev