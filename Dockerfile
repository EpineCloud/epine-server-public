# BUILDER IMAGE
FROM node:16.13.1-buster AS builder
ARG NPM_TOKEN
ENV NODE_PATH=.
ENV JOBS="max"
WORKDIR /usr/src/app

ENV DOCKERIZE_VERSION v0.6.1
RUN wget -q "https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz" && \
    tar -C /usr/local/bin -xzvf "dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz" && \
    rm "dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz"

ENV TINI_VERSION v0.19.0
RUN wget -q https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini -O /tini && \
    chmod +x /tini

# important, otherwise postinstall hook fails
RUN npm set unsafe-perm=true
RUN npm set progress=false
RUN npm set loglevel=error
# copy all relevant files
COPY . .
# RUN echo "//registry.npmjs.org//:_authToken=$NPM_TOKEN" >> .npmrc
# install dependencies
RUN npm ci
# compile typescript
RUN npm run build

# MAIN IMAGE
FROM node:16.13.1-buster-slim
ENV NODE_PATH=dist
ENV CFG_JSON_PATH="/config/secrets.json"

RUN apt-get update && \
    rm -rf /var/lib/apt/lists/*

RUN apt-get update \
     && apt-get install -y gnupg2 ca-certificates \
     # Install latest chrome dev package, which installs the necessary libs to
     # make the bundled version of Chromium that Puppeteer installs work.
     && apt-get install -y wget --no-install-recommends \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 \
     libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm-dev libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 \
     libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 \
     libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils google-chrome-unstable --no-install-recommends \
     && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app /usr/src/app
COPY --from=builder /tini /tini
COPY --from=builder /usr/local/bin/dockerize /usr/local/bin/dockerize
EXPOSE 3000
USER node
ENTRYPOINT ["/tini", "--", "/usr/local/bin/docker-entrypoint.sh"]
CMD [ "node", "-r", "source-map-support/register", "dist/index.js"]
