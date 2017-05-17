FROM node:7

ENV VERSION 0.0.2

RUN curl -L https://github.com/thomasnordquist/peek-a-boo/archive/$VERSION.tar.gz -o app.tar.gz \
	&& tar -xf app.tar.gz \
	&& mv /peek-a-boo-$VERSION /app \
	&& rm app.tar.gz

WORKDIR /app
RUN yarn install \
	&& yarn run build \
	&& yarn install --production \
	&& yarn cache clean


# This is where people.db will be, it stores info on people and their associated devices
VOLUME /app/stores

EXPOSE 8080

CMD yarn run service
