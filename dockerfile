FROM node:14

WORKDIR /projeto-empresa-sem-nome
COPY package.json .
RUN npm install
COPY . .
CMD npm start dev