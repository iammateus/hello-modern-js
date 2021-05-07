FROM node:16.1

WORKDIR /var/www/html

COPY . .

RUN yarn global add gulp-cli
RUN yarn install

CMD [ "gulp" ]