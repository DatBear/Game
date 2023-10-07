FROM node:18.0.0 as build

WORKDIR /next-app

COPY next/package*.json .
COPY next/yarn.lock .
RUN yarn install
COPY ./next/. .

EXPOSE 8080
CMD yarn prisma:build:start -- -p 8080