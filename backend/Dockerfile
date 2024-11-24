FROM node:18

WORKDIR /app/backend
COPY package.json yarn.lock tsconfig.json ./
RUN yarn install
COPY backend/ ./backend/
RUN yarn build

EXPOSE 8080

CMD ["node", "dist/server.js"]
