FROM node:12.14

WORKDIR /usr/src/
COPY package.json /usr/src/

EXPOSE 8080

RUN git config --global url.https://github.com/.insteadOf git://github.com/
RUN npm install
RUN npm install --save-dev nodemon

## THE LIFE SAVER
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && npm start