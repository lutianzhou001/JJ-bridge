FROM node:10.13.0-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install pm2 -g
RUN npm i -g typescript
RUN npm run build

COPY ./dist .

EXPOSE 3000

CMD [ "pm2-runtime", "main.js" ]
