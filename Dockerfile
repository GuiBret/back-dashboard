FROM node:14-alpine AS compile-image

WORKDIR /app/backend

COPY package.json .

RUN npm install --legacy-peer-deps

COPY ./src ./src
COPY ./backend ./backend
COPY ./config ./config

COPY ./tsconfig.build.json .
COPY ./tsconfig.json .

RUN npm run build

FROM node:14-alpine

WORKDIR /app

COPY --from=compile-image /app/backend/dist/src .

COPY --from=compile-image /app/backend/node_modules ./node_modules

COPY package.json .

RUN npm install -g pm2

EXPOSE 5000

CMD ["npm", "run", "start:prod"]