FROM node:24-alpine3.22

WORKDIR /docker-node-mysql

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]