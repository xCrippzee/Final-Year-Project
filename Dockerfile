FROM node:14
MAINTAINER Ash Cripps <14062034>
EXPOSE 3000
RUN apt-get update 
RUN apt-get upgrade -y
RUN apt-get install -y libmongoc-1.0-0
RUN mkdir -p /monapp
WORKDIR /monapp
COPY . .
RUN npm install
ENTRYPOINT ["node","server.js"]
