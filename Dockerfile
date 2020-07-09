FROM node:14.4.0-alpine as builder

RUN mkdir /code && cd /code

COPY package.json /code

RUN npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/ && npm config set registry https://registry.npm.taobao.org
RUN npm install --verbose

FROM node:14.4.0-alpine
RUN mkdir /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app
COPY ./ /usr/src/next-app/
COPY --from=builder /usr/src/nuxt-app/node_modules ./node_modules
EXPOSE 3000
RUN npm run build
CMD ["npm","start"]

