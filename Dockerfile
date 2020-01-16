FROM node:10.13.0-alpine
WORKDIR /usr/src/hudex

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run tsc

EXPOSE 3000

CMD [ "npm", "start" ]
