FROM node:12.17.0
LABEL maintainer="cristhofer.mendonca"

RUN mkdir -p /usr/src/api

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3005

CMD [ "npm", "run", "dev" ]