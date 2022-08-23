# Base image
FROM node:16

RUN apt-get update
# for https
RUN apt-get install -yyq ca-certificates
# install libraries
RUN apt-get install -yyq libappindicator1 libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 libgbm-dev
# tools
RUN apt-get install -yyq gconf-service lsb-release wget xdg-utils
# and fonts
RUN apt-get install -yyq fonts-liberation

# Create app directory
WORKDIR /usr/src/app
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY decorate-angular-cli.js ./
# Install app dependencies
RUN npm install
RUN npm install -g @angular/cli
RUN npm install -g nx

# Bundle app source
COPY . .
# Creates a "dist" folder with the production build
RUN npm run build api

# Start the server using the production build
EXPOSE 3000
CMD [ "npm", "run", "start", "api" ]