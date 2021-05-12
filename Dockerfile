FROM node:14 AS node1
WORKDIR /fireStoreAPI
COPY /fireStoreAPI/package*.json ./
COPY /fireStoreAPI ./
RUN npm install
COPY fireStoreAPI/index.js ./

FROM node:14
WORKDIR /app
COPY /nicejob/package*.json ./
RUN npm install
COPY /nicejob/dist ./
COPY /nicejob/keys ./
COPY --from=node1 /fireStoreAPI /fireStoreAPI
RUN npm install /fireStoreAPI && apt-get update && apt-get install -y redis-server && service redis-server start
EXPOSE 3000
EXPOSE 6379
CMD [ "node", "./bin/www" ]
#CMD [ "ls", "-al" ]
