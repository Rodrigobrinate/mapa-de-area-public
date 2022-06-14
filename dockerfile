FROM node:16.9.0

WORKDIR /projeto-empresa-sem-nome
COPY package.json .
RUN npm install
COPY . .
CMD npm start dev