# Base image
FROM node:16
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
RUN npm run build dominator

# Start the server using the production build
EXPOSE 4200

CMD [ "ng", "serve", "dominator", "--host=0.0.0.0"]