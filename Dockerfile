FROM node:22

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/
COPY rofibot.js /app/

RUN npm install
RUN npm run build

CMD [ "node", "rofibot.js" ].