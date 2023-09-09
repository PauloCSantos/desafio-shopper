FROM node:lts-hydrogen

WORKDIR /app
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