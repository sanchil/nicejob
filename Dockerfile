FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY dist ./
COPY keys ./
EXPOSE 3000
CMD [ "node", "./bin/www" ]
