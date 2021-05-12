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
RUN npm install /fireStoreAPI
EXPOSE 3000
CMD [ "node", "./bin/www" ]
