FROM node:16-alpine as build

ARG APP_DIR

ARG NODE_LIBS

WORKDIR /app

COPY ./dist/${APP_DIR}/package.json .

RUN yarn add reflect-metadata tslib @automapper/core $NODE_LIBS

RUN yarn install --only=production

COPY ./dist/${APP_DIR} .

FROM node:16-alpine as serve

RUN apk add --no-cache \
        python3 \
        py3-pip \
    && pip3 install --upgrade pip \
    && pip3 install --no-cache-dir \
        awscli \
    && rm -rf /var/cache/apk/*

RUN aws --version

WORKDIR /app

ENV NO_COLOR=true
ENV NODE_ENV=production

COPY --from=build /app/ ./
COPY --from=build /app/package* ./

EXPOSE ${APP_PORT}

CMD node ./main.js
