FROM node:14.4.0-alpine as builder

RUN mkdir /code && cd /code
WORKDIR /code
COPY package.json /code

RUN npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/ && npm config set registry https://registry.npm.taobao.org
RUN npm install

FROM node:14.4.0-alpine
RUN mkdir /nuxt
WORKDIR /nuxt
COPY ./ /nuxt/
COPY --from=builder /code/node_modules ./node_modules
EXPOSE 3000
EXPOSE 3001
CMD ["npm", "run", "start"] 