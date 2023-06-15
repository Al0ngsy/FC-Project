FROM node:14-alpine

RUN apk update
ENV NODE_ENV=prod

# Set the working directory
WORKDIR /app

# Copy package.json and lock file to the container
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --production --pure-lockfile && yarn cache clean

COPY /dist /app/dist

# Expose a port 
EXPOSE 5559

# Define the command to run your application
CMD [ "yarn", "run", "start-container" ]