FROM node:slim

WORKDIR /app

# Install nodemon globally for live reload
RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7000

CMD ["node" , "index"]