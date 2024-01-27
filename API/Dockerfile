# Installing dependencies:
FROM node:18 AS install-dependencies
WORKDIR /usr/src/app
RUN npm install -g npm@9.3.1
COPY package.json package-lock.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start:dev"]
