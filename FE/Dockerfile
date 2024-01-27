#Stage 1
FROM node:18 as builder
WORKDIR /usr/src/app
RUN npm install -g npm@9.3.1
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 5556
CMD ["npm", "run", "start"]
