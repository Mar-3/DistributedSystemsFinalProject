FROM node:21.7.2-alpine3.18 

WORKDIR /frontend/

COPY public/ /frontend/public
COPY src/ /frontend/src
COPY package.json /frontend/

RUN npm install

CMD ["npm", "start"]
EXPOSE 3000
