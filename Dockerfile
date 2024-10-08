FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN ls -la

EXPOSE 3000

CMD ["node", "App.mjs"]