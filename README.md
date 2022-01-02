# Creating a new Node App
## Installing Node.js
### What is Node?
Node / Node.js is an open-source, cross-platform runtime environment that allows developers to create server-side applications in JavaScript. 
The node package manager (NPM) provides access to hundreds of thousands of reusable packages.

To start building your Node.js applications, the first step is to install node.js framework. For different OS, differnt pre-built installer for your platform are available.<br> 
Link to download npm package- https://nodejs.org/en/download/

### Web Frameworks- Express
Express is the most popular Node web framework. It helps in handling different HTTP methods - GET, POST, DELETE, etc., separately handle requests recieved at different URL paths or routes by Routing, serve static files, or use templates to dynamically create the response.

## Creating an App
### Step 1 : Install Express Package 
Express package enables your application to handle different incoming requests to the application. For installing a new package use the npm install command. This command will update package.json file by adding the newly installed package to the list of dependencies.
### `npm install <package-name>`
### `npm install express`

### Step 2 : Create a new file server.js
This will be an entry point of your application. The routes will be added in this file. It will invoke the methods created in App.js file, that implement different business functionalities.

## Step 3: Configure MongoDB Atlas
 MongoDB Atlas provides an easy way to host and manage your data in the cloud.
Steps for connecting to a Collection in MongoDB Atlas : 
* Create an Atlas Account.
* Deploy a Free Cluster.
* Add Your Connection IP Address to Your IP Access List.
* Create a Database User for Your Cluster.
* Connect to Your Cluster.

## Step 4: Adding mongodb and mongoose in the application
To work with Mongodb we need to install 2 packages:
### `npm install mongodb`
### `npm install mongoose`
Create a .env file in your Root directory and add a variable MONGO_URI="<connection string of the MongoDB Atlas>"
To import this variable in your App.js file(explained below), add the following statement:### `require('dotenv').config();`
`const mongoose = require('mongoose');`
`mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });`
Using the mongoose object, you can create a Schema for your collection. Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
## Step 5 : Create an App.js file 
You can write the methods that implement different functionalities like connecting to database, storing fetching data from the database etc. The methods in this file will be invoked from the server.js which will be acting as the server running on port 3000. 

### Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

This command executes 'node server.js' - in simple terms, starts your server on Port 3000, that listens to requests from clients