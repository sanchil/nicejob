FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY dist ./
EXPOSE 8080
CMD [ "node", "./bin/www" ]
#CMD [ "ls", "-al" ]
