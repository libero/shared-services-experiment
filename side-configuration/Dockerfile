FROM node:10-alpine
RUN mkdir /opt/side-configuration
WORKDIR /opt/side-configuration
RUN mkdir /etc/configuration

COPY package.json src/server.js /opt/side-configuration/

RUN npm install
CMD ["/usr/local/bin/node", "/opt/side-configuration/server.js"]
