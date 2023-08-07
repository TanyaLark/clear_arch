FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock nest-cli.json /app/
RUN yarn install
COPY . /app
RUN yarn run nest build
CMD [ "./node_modules/.bin/nest", "start"]