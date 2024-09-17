FROM node:17

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install Dependencies
COPY package.json ./
RUN npm install
ENV NODE_ENV prod
# Copy app source code
COPY . .

# Exports
EXPOSE 5000
CMD ["npm","start"]
