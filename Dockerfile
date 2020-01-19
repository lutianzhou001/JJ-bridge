FROM alpine
FROM node:10
WORKDIR /usr/src/app

COPY . .
RUN npm install
RUN npm install pm2 -g
RUN npm i -g typescript
RUN npm run build

EXPOSE 3000

CMD [ "pm2-runtime", "./dist/main.js" ]
