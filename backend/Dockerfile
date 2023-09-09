FROM node:lts-hydrogen

WORKDIR /app
<<<<<<< HEAD
RUN npm install -g typescript
COPY package*.json ./
RUN npm install
COPY . .
RUN tsc
WORKDIR /app/dist
EXPOSE 4000
#VOLUME ["app/node_modules", "app/dist"]
#VOLUME /app/node_modules
#VOLUME /app/dist

CMD ["node", "app.js"]
=======

COPY . .

CMD ["node", "index.js"]
>>>>>>> 7a4612c4f671ac5dae12901a045adeeb32dd099f
