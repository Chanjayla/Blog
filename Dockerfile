FROM node:alpine as builder

RUN mkdir /code
COPY package.json /code
RUN npm install
COPY . /code
RUN npm run start

