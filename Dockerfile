FROM node:13.8

WORKDIR /app
COPY . .

EXPOSE 3050

RUN npm install -g nodemon
RUN npm install
RUN npm install bcrypt@latest --save