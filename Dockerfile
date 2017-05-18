FROM node:7

ENV VERSION 0.0.4

RUN curl --silent --location https://github.com/thomasnordquist/peek-a-boo/archive/$VERSION.tar.gz | tar xzv \
 && mv /peek-a-boo-$VERSION /app

WORKDIR /app
RUN yarn install \
 && yarn run build \
 && yarn install --production \
 && yarn cache clean

# This is where people.db will be, it stores infos on people and their associated devices
VOLUME /app/stores

EXPOSE 8080

CMD yarn run service
