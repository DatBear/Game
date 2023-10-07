FROM node:18.0.0 as build

WORKDIR /next-app

ARG ENV_FILE

COPY next/package*.json .
COPY next/yarn.lock .
RUN yarn --frozen-lockfile
COPY ./next/. .
COPY next/${ENV_FILE} ./.env
RUN yarn prisma:build

FROM node:18-alpine as run
WORKDIR /next-app
COPY --from=build /next-app/package.json .
COPY --from=build /next-app/yarn.lock .
COPY --from=build /next-app/next.config.js ./
COPY --from=build /next-app/public ./public
COPY --from=build /next-app/.next/standalone ./
COPY --from=build /next-app/.next/static ./.next/static
ENV PORT 8080
EXPOSE 8080
ENTRYPOINT ["node", "server.js"]