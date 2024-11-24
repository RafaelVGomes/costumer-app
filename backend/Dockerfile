FROM node:18

WORKDIR /app
COPY package.json yarn.lock tsconfig.json ./
RUN yarn install
COPY backend/ ./backend/
RUN yarn build

EXPOSE 8080

CMD ["node", "backend/dist/server.js"]
