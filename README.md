# Serverless Recipes

Serverless Recipes is an application that allows users to upload their recipes and photos of the prepared food to a server.
The users authorize themselves and see only the photos they uploaded.
Serverless Recipes is developed as a serverless application in the AWS cloud, the photos are also stored in the cloud.

# How to run the application

To start the application, Serveless Command Line Interface (CLI) must be installed. This can be done for example via npm with the command

```
npm install -g serverless
```

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless Recipe application.
