#Stage 1
FROM node:18 as builder
WORKDIR /usr/src/fe
RUN npm install -g npm@9.3.1
COPY package.json package-lock.json ./
ADD package.json /usr/src/fe/package.json
RUN npm install
COPY . .
RUN chmod 755 /usr/src/fe
CMD ["npm", "run", "start"]
