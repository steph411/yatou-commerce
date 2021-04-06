FROM node:14.16.0

RUN mkdir /dashboard-ui

WORKDIR /dashboard-ui

COPY package.json .

RUN npm install

# ENV PATH="./node_modules/.bin:$PATH"

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]