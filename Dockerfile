FROM node:12.17.0

LABEL maintainer="cristhofer.mendonca"

RUN mkdir -p /usr/src/api

WORKDIR /usr/src/api

RUN npm install && \
    npm install bcrypt@latest --save

COPY . .

EXPOSE 3005

CMD [ "npm", "run", "dev" ]